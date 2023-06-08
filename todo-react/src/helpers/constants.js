const token = localStorage.getItem("token");
export const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export const color = (priority) => {
  switch (priority) {
    case 1:
      return "common.red";
    case 2:
      return "#eb8909";
    case 3:
      return "primary.main";
    default:
      return "text.secondary";
  }
};

export const priorities = [1, 2, 3, 4]; // Array of available priority options

