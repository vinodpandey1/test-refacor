import axios from "axios";

const adminGatewayUrl = process.env.REACT_APP_ADMIN_GATEWAY_URL
const GET_LOGGED_IN_USER_URL = `${adminGatewayUrl}/gateways/pms/class/auth/functions/getLoggedInUser`;

export const getLoggedInUser = async (): Promise<any> => {
  const response = await axios
    .get(GET_LOGGED_IN_USER_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

  return response.data;
};
