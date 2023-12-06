type Campaign = {
  id: number;
  title: string;
  keywords: string[];
  bidAmount: number;
  fund: number;
  status: 'on' | 'off';
  town: string;
  radius: number;
};
