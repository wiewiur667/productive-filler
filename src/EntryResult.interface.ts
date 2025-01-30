export interface EntryResult {
  id: string;
  type: 'time_entries';
  attributes: {
    date: string;
    time: number;
    note: string;
  }
  relationships: {
    organization: {
      data: {
        type: 'organizations';
        id: number;
      }
    },
    person: {
      data: {
        type: 'people';
        id: number;
      }
    },
    service: {
      data: {
        type: 'services';
        id: number;
      }
    }
  }
}