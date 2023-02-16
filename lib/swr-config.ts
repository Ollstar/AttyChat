// my-swr-config.ts
import toast from 'react-hot-toast';
import { SWRConfiguration } from 'swr';

const mySwrConfig: SWRConfiguration = {
  // set your SWR options here
  revalidateOnFocus: false,
  errorRetryCount: 3,
  // set your custom fetcher function if needed
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
  // set your cache configuration if needed
  dedupingInterval: 60000,
  // set a global `onError` handler to handle SWR errors
  onError: (err, key) => {
    console.error(`SWR error for ${key}: ${err}`);
    toast.error(`Error fetching ${key}: ${err}`);
  },
  onSuccess: (data, key, config) => {
      toast.success(`Successful ${key} operation`);
    },


};

export default mySwrConfig;
