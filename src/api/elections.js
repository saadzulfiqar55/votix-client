import api from "./client";

// Auth (primary source is auth.js — these are re-exports for convenience)
export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);
export const logout = () => api.post("/api/auth/logout");
export const me = () => api.get("/api/auth/me");

// Provinces
export const getProvinces = () => api.get("/api/provinces");
export const createProvince = (data) => api.post("/api/provinces", data);
export const updateProvince = (id, data) => api.put(`/api/provinces/${id}`, data);
export const deleteProvince = (id) => api.delete(`/api/provinces/${id}`);

// Districts
export const getDistricts = (params) => api.get("/api/districts", { params });
export const createDistrict = (data) => api.post("/api/districts", data);
export const updateDistrict = (id, data) => api.put(`/api/districts/${id}`, data);
export const deleteDistrict = (id) => api.delete(`/api/districts/${id}`);

// Parties
export const getParties = () => api.get("/api/parties");
export const createParty = (data) => api.post("/api/parties", data);
export const updateParty = (id, data) => api.put(`/api/parties/${id}`, data);
export const deleteParty = (id) => api.delete(`/api/parties/${id}`);

// Constituencies
export const getConstituencies = () => api.get("/api/constituencies");
export const createConstituency = (data) => api.post("/api/constituencies", data);
export const deleteConstituency = (id) => api.delete(`/api/constituencies/${id}`);

// Polling Stations
export const getPollingStations = (params) => api.get("/api/polling-stations", { params });
export const getPollingStationsByConstituency = (code) => api.get(`/api/polling-stations/constituency/${code}`);
export const createPollingStation = (data) => api.post("/api/polling-stations", data);
export const updatePollingStation = (id, data) => api.put(`/api/polling-stations/${id}`, data);
export const deletePollingStation = (id) => api.delete(`/api/polling-stations/${id}`);

// Elections
export const getElections = (params) => api.get("/api/elections", { params });
export const getElection = (id) => api.get(`/api/elections/${id}`);
export const createElection = (data) => api.post("/api/elections", data);
export const updateElection = (id, data) => api.put(`/api/elections/${id}`, data);
export const deleteElection = (id) => api.delete(`/api/elections/${id}`);
export const transitionElection = (id, status) => api.post(`/api/elections/${id}/transition`, { status });
export const openVoting = (id) => api.post(`/api/elections/${id}/start`);
export const closeVoting = (id) => api.post(`/api/elections/${id}/close`);
export const publishElection = (id) => api.post(`/api/elections/${id}/publish-results`);
export const getReadiness = (id) => api.get(`/api/elections/${id}/readiness`);

// Candidates
export const getCandidates = (id, constituencyCode) => api.get(`/api/elections/${id}/candidates`, { params: { constituency: constituencyCode } });
export const addCandidate = (id, data) => api.post(`/api/elections/${id}/candidates`, data);
export const updateCandidate = (electionId, id, data) => api.put(`/api/elections/${electionId}/candidates/${id}`, data);
export const deleteCandidate = (electionId, id) => api.delete(`/api/elections/${electionId}/candidates/${id}`);

// Voting
export const castVote = (electionId, candidateId, seatType) => api.post(`/api/elections/${electionId}/vote`, { candidateId, seatType });

// Voter List
export const getVoterList = (params) => api.get("/api/voter-list", { params });
export const importVoters = (data) => api.post("/api/voter-list/import", data);
export const assignVoterStation = (id, pollingStationId) => api.put(`/api/voter-list/${id}/assign`, { pollingStationId });
export const verifyVoterEntry = (id) => api.put(`/api/voter-list/${id}/verify`);
export const verifyVoterSearch = (data) => api.post("/api/voter-list/verify-voter", data);

// Results
export const submitStationResult = (data) => api.post("/api/results/polling-station", data);
export const reviewStationResult = (id, action, reason) => api.post(`/api/results/${id}/review`, { action, reason });
export const aggregateResults = (electionId, constituencyId, seatType) => api.post(`/api/results/aggregate/${electionId}/${constituencyId}/${seatType}`);
export const finalizeResult = (data) => api.post("/api/results/finalize", data);
export const getConstituencyResults = (electionId) => api.get(`/api/results/constituency/${electionId}`);
export const getStationResults = (electionId, constituencyId, seatType) => api.get(`/api/results/station/${electionId}/${constituencyId}`, { params: { seatType } });
export const getGlobalResults = () => api.get("/api/elections/results/global");
export const getElectionResults = (id) => api.get(`/api/elections/${id}/results`);

// Admin
export const getUsers = () => api.get("/api/admin/users");
export const updateUser = (id, data) => api.put(`/api/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const getAuditLogs = () => api.get("/api/admin/audit-logs");
