export interface BranchDto {
  branchName: string;
  address: string;
  mobile: string;
  password: string;
  showName: string;
  user: string;
  shamsiCreatedAt: string;
  ip?:string
}
export interface BranchLoginDTo {
  branchName: string;
  password: string;
  ip: string;
}
