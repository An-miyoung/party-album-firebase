export const ROUTES = {
  JOIN: "/join",
  SHOW_POST_DETAIL: "/groups/:guid/post",
  ADD_MEMBERS: "/groups/members",
  GROUPS_LIST: "/groups",
};

// ROUTES.ADD_MRMBERS 의 :guid가  실제 guid 갑으로 동적으로 연결될 수 있도록
const replaceGuid = (route, guid) => route.replace(":guid", guid);

// 매번 replaceGuid(ROUTES.ADD_MEMBERS, 1234567) 을 부르기 번거롭기 때문에
export const ROUTE_UTILS = {
  SHOW_POST_DETAIL: (guid) => replaceGuid(ROUTES.SHOW_POST_DETAIL, guid),
};
