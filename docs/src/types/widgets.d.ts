type Widget = {
  id: string;
  name: string;
  label?: string;
  url: string;
  carrierIds: number[];
  scopes: {
    location: string;
    positions: string[];
  }[];
  dealers: {
    allDealers: boolean;
    dealerIds?: number[];
  };
  type: "iframe" | "native";
  native?: {
    remote: string;
    module: string;
  };
  priority: number;
  options?: {
    defaultExpanded?: boolean;
  };
};

type User = {
  carrier_id: number;
  dealer_id: number;
  email: string;
  language: string;
};
