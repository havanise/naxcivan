export { client } from "./axios-config";
export { checkToken, login } from "./auth";
export { fetchProfileInfo } from "./tenant";
export {
  getCall,
  fetchCallCount,
  updateRequestStatus,
  closeRequest,
  fetchCallDetail,
  updateAmbulanceRequest,
  fetchRequestComments,
  createComment,
  uploadAttachment,
  deleteAttachment
} from "./call";
export {
  fetchBusinessSettings,
  fetchUnitBrigade,
  fetchMedInstitution,
} from "./businessUnit";
export { fetchInitialDiagnoses } from "./settings";
