export const RAW_QUERY_FILE = 'query.json';
export const ALLOW_ORIGIN_1 = 'https://staging-bazaar.wrld.xyz';
export const ALLOW_ORIGIN_2 = 'https://development-bazaar.wrld.xyz';
export const ALLOW_ORIGIN_3 = 'https://bazaar.wrld.xyz';
export const ALLOW_ORIGIN_4 = 'https://mv-marketplace.vercel.app';
export const ALLOW_ORIGIN_5 = 'http://localhost:3000';
export const ALLOW_ORIGIN_6 = 'https://dev-admin.wrld.xyz';
export const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000';
export const USER_STATE = {
  description: 'user state management',
  name: 'userStateMgmt',
  attributes: [
    {
      trait_type: 'user_id',
      value: 0,
    },
    {
      trait_type: 'user_name',
      value: '',
    },
    {
      trait_type: 'user_email',
      value: '',
    },
    {
      trait_type: 'user_wallet_address',
      value: '',
    },
    {
      trait_type: 'profile_image',
      value: '',
    },
    {
      trait_type: 'twitter',
      value: '',
    },
    {
      trait_type: 'instagram',
      value: '',
    },
  ],
  user_favorite: {
    description: 'user favorite',
    name: 'userFavoriteMgmt',
    attributes: [],
  },
};
