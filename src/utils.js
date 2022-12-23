import axios from "axios";
import { PAGE_LIMIT } from "./constants";

const baseUrl = process.env.REACT_APP_API_URL;

export const getMembers = ({ page = 1, limit = PAGE_LIMIT }) => {
  return axios({
    method: "GET",
    url: `${baseUrl}/members?page=${page}&limit=${limit}`,
  }).then(({ data }) => data);
};

export const updateMember = (member) => {
  return axios({
    method: "PUT",
    url: `${baseUrl}/members/${member.id}`,
    data: member,
  }).then(({ data }) => data);
};

export const deleteMember = (member) => {
  return axios({
    method: "DELETE",
    url: `${baseUrl}/members/${member.id}`,
  }).then(({ data }) => data);
};

export const getTeamColor = (num) => {
  const colors = ["blue", "pink", "sky", "purple", "orange", "violet"];
  return colors[num % colors.length];
};
