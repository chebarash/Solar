export type IconsType = {
  [category: string]: {
    [name: string]: {
      [style: string]: string;
    };
  };
};

export type ReqType = { date: Date; time: number; cached: boolean };

export type ImpType = { date: Date; icons: Array<string> };

export type IconReqType = {
  category: string;
  name: string;
  style: string;
  color?: string;
};

export type TopType = { [name: string]: number };
