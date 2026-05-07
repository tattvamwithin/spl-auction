import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as actions from '../lib/actions';

const useAuctionStore = create(
  (set, get) => ({
    players: [],
    teams: [],
    currentPlayerIndex: 0,
    currentBid: 0,
    highestBidder: null,
    auctionHistory: [],
    isPaused: true,
    isLoading: true,

    // Initial Sync
    fetchInitialData: async () => {
      set({ isLoading: true });
      try {
        const [players, teams, history] = await Promise.all([
          actions.getPlayers(),
          actions.getTeams(),
          actions.getAuctionHistory()
        ]);
        set({ players, teams, auctionHistory: history, isLoading: false });
      } catch (error) {
        console.error('Failed to fetch data from DB:', error);
        set({ isLoading: false });
      }
    },

    // Navigation
    nextPlayer: () => {
      const { currentPlayerIndex, players } = get();
      if (currentPlayerIndex < players.length - 1) {
        set({
          currentPlayerIndex: currentPlayerIndex + 1,
          currentBid: 0,
          highestBidder: null,
        });
      }
    },

    prevPlayer: () => {
      const { currentPlayerIndex } = get();
      if (currentPlayerIndex > 0) {
        set({
          currentPlayerIndex: currentPlayerIndex - 1,
          currentBid: 0,
          highestBidder: null,
        });
      }
    },

    // Auction Logic
    placeBid: (teamId, amount) => {
      const { currentBid, players, currentPlayerIndex, teams } = get();
      const player = players[currentPlayerIndex];
      const team = teams.find(t => t.id === teamId);

      const newBid = currentBid === 0 ? player.basePrice + amount : currentBid + amount;

      if (team.budgetRemaining >= newBid) {
        set({
          currentBid: newBid,
          highestBidder: teamId,
        });
        return true;
      }
      return false;
    },

    markSold: async (teamId, price) => {
      const { players, currentPlayerIndex } = get();
      const player = players[currentPlayerIndex];
      
      await actions.syncSoldPlayer(player.id, teamId, price);
      await get().fetchInitialData(); // Sync back from DB
      
      set({
        currentBid: 0,
        highestBidder: null,
      });

      get().nextPlayer();
    },

    markUnsold: async () => {
      const { players, currentPlayerIndex } = get();
      const player = players[currentPlayerIndex];
      
      await actions.updatePlayer(player.id, { status: 'Unsold' });
      await get().fetchInitialData();
      
      set({
        currentBid: 0,
        highestBidder: null,
      });

      get().nextPlayer();
    },

    // CRUD Actions with DB Sync
    addPlayer: async (playerData) => {
      let finalData = { ...playerData };
      if (playerData.profilePhoto?.startsWith('data:image')) {
        const photoPath = await actions.uploadPlayerImage(playerData.name, playerData.profilePhoto);
        finalData.profilePhoto = photoPath;
      }
      await actions.createPlayer(finalData);
      await get().fetchInitialData();
    },

    updatePlayer: async (playerData) => {
      let finalData = { ...playerData };
      if (playerData.profilePhoto?.startsWith('data:image')) {
        const photoPath = await actions.uploadPlayerImage(playerData.name, playerData.profilePhoto);
        finalData.profilePhoto = photoPath;
      }
      await actions.updatePlayer(playerData.id, finalData);
      await get().fetchInitialData();
    },

    deletePlayer: async (playerId) => {
      await actions.deletePlayer(playerId);
      await get().fetchInitialData();
    },

    bulkAddPlayers: async (newPlayers) => {
      const result = await actions.bulkCreatePlayers(newPlayers);
      await get().fetchInitialData();
      return result;
    },

    addTeam: async (teamData) => {
      await actions.createTeam(teamData);
      await get().fetchInitialData();
    },

    updateTeam: async (team) => {
      await actions.updateTeam(team.id, team);
      await get().fetchInitialData();
    },

    deleteTeam: async (teamId) => {
      await actions.deleteTeam(teamId);
      await get().fetchInitialData();
    },

    resetAuction: async () => {
      await actions.resetAuctionDB();
      await get().fetchInitialData();
      set({
        currentPlayerIndex: 0,
        currentBid: 0,
        highestBidder: null,
      });
    },
  })
);

export default useAuctionStore;
