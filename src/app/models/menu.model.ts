export interface MenuItem {
  menuGuid: string;
  menuId: number;
  menuName: string;
  url: string;
  icon: string;
  menuCode: string;
  parentId: number;
  children?: MenuItem[]; // For nested menu structure
}