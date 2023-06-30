import { useDispatch } from 'react-redux';

import { AppThunkDispatch } from './appStoreTypes';

export const useThunkDispatch = useDispatch<AppThunkDispatch>;
