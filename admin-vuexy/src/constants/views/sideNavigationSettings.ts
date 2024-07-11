// ** Type import
import { VerticalNavItemsType } from "../../@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: "Application",
    },

    {
      title: "Coupons",
      icon: "tabler:users",
      path: "/home/coupons",
    },
    {
      title: "Sign Out",
      icon: "tabler:logout",
      path: "/auth/signout",
    }
    
  ];
};

export default navigation;
