export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  badge?: number;
  disabled?: boolean;
  permissions?: string[];
}
