export type IconsType = {
  [category: string]: {
    [name: string]: {
      [style: string]: string;
    };
  };
};
export type ReqType = { date: Date; time: number };
export type ImpType = { date: Date; icons: Array<string> };
