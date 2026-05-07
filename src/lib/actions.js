'use server';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// Players
export async function uploadPlayerImage(playerName, base64Data) {
  try {
    const dir = path.join(process.cwd(), 'public', 'players');
    await fs.mkdir(dir, { recursive: true });

    // Clean player name for filename - more robust sanitization
    const fileName = `${playerName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    const filePath = path.join(dir, fileName);

    console.log('Saving image for', playerName, 'to', filePath);

    // Remove metadata prefix from base64 string
    const base64Image = base64Data.includes(';base64,') 
      ? base64Data.split(';base64,').pop() 
      : base64Data;

    await fs.writeFile(filePath, base64Image, { encoding: 'base64' });
    console.log('Successfully saved image:', fileName);

    return `/players/${fileName}`;
  } catch (error) {
    console.error('Failed to save image:', error);
    throw new Error('Failed to save player image');
  }
}
export async function getPlayers() {
  return await prisma.player.findMany({
    orderBy: { createdAt: 'asc' }
  });
}

export async function createPlayer(data) {
  const player = await prisma.player.create({ data });
  revalidatePath('/');
  return player;
}

export async function updatePlayer(id, data) {
  // Sanitize data
  const { id: _, team, createdAt, updatedAt, ...cleanData } = data;
  const player = await prisma.player.update({
    where: { id },
    data: cleanData
  });
  revalidatePath('/');
  return player;
}

export async function deletePlayer(id) {
  await prisma.player.delete({ where: { id } });
  revalidatePath('/');
}

export async function bulkCreatePlayers(players) {
  // Get all existing names to avoid duplicates
  const existingPlayers = await prisma.player.findMany({ select: { name: true } });
  const existingNames = new Set(existingPlayers.map(p => p.name.trim().toLowerCase()));

  // Filter out players that already exist
  const newPlayers = players.filter(p => {
    const trimmedName = p.name?.trim().toLowerCase();
    return trimmedName && !existingNames.has(trimmedName);
  });

  if (newPlayers.length === 0) {
    return { count: 0 };
  }

  const result = await prisma.player.createMany({
    data: newPlayers.map(p => ({
      name: p.name.trim(),
      age: parseInt(p.age) || 0,
      role: p.role,
      category: p.category,
      basePrice: parseInt(p.basePrice) || 0,
      profilePhoto: p.profilePhoto,
      status: 'Available',
      jerseyNumber: p.jerseyNumber?.toString(),
      mobileNumber: p.mobileNumber?.toString()
    }))
  });
  revalidatePath('/');
  return result;
}

// Teams
export async function getTeams() {
  return await prisma.team.findMany({
    include: { players: true },
    orderBy: { name: 'asc' }
  });
}

export async function createTeam(data) {
  const team = await prisma.team.create({ data });
  revalidatePath('/');
  return team;
}

export async function updateTeam(id, data) {
  // Sanitize data
  const { id: _, players, createdAt, updatedAt, ...cleanData } = data;
  const team = await prisma.team.update({
    where: { id },
    data: cleanData
  });
  revalidatePath('/');
  return team;
}

export async function deleteTeam(id) {
  await prisma.team.delete({ where: { id } });
  revalidatePath('/');
}

// Auction Logic Sync
export async function syncSoldPlayer(playerId, teamId, price) {
  await prisma.$transaction([
    prisma.player.update({
      where: { id: playerId },
      data: {
        status: 'Sold',
        soldTo: teamId,
        soldPrice: price
      }
    }),
    prisma.team.update({
      where: { id: teamId },
      data: {
        budgetRemaining: { decrement: price }
      }
    }),
    prisma.auctionHistory.create({
      data: {
        playerId,
        playerName: (await prisma.player.findUnique({ where: { id: playerId } })).name,
        teamId,
        teamName: (await prisma.team.findUnique({ where: { id: teamId } })).name,
        price
      }
    })
  ]);
  revalidatePath('/');
}

export async function getAuctionHistory() {
  return await prisma.auctionHistory.findMany({
    orderBy: { timestamp: 'desc' }
  });
}

export async function resetAuctionDB() {
  await prisma.$transaction([
    prisma.auctionHistory.deleteMany(),
    prisma.player.updateMany({
      data: {
        status: 'Available',
        soldTo: null,
        soldPrice: 0
      }
    }),
    prisma.team.updateMany({
      data: {
        budgetRemaining: 10000 // Reset to 100 Cr
      }
    })
  ]);
  revalidatePath('/');
}
