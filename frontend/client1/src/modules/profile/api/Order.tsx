import axios from "axios";
import { ACCESS_TOKEN } from "../../../constants/constants";

export const getOrder = async (id :string ) => {
    const url = `http://localhost:61955/Bill/GetTransactions?UserID=${id}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
      }
    }
  );
    const result = (await response.status) === 200 ? response.data : [];
    return result;
  };
  