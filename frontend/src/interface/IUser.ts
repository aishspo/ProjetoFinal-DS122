import { Folder } from "./IFolder";

export interface User {
  id: number;
  name: string;
  user?: {
    email: string;
  };
  folders: Folder[];
  }
  