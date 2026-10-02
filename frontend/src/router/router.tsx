import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import RouteError from '../components/Common/RouteError';

import Home from '../pages/Home/Home';
import Basics from '../pages/Basics/Basics';
import Array from '../pages/Array/Array';
import LinkedList from '../pages/LinkedList/LinkedList';
import Stack from '../pages/Stack/Stack';
import Queue from '../pages/Queue/Queue';
import CircularQueue from '../pages/CircularQueue/CircularQueue';
import Searching from '../pages/Searching/Searching';
import LinearSearch from '../pages/Searching/LinearSearch';
import BinarySearch from '../pages/Searching/BinarySearch';
import Sorting from '../pages/Sorting/Sorting';
import BubbleSort from '../pages/Sorting/BubbleSort';
import SelectionSort from '../pages/Sorting/SelectionSort';
import InsertionSort from '../pages/Sorting/InsertionSort';
import MergeSort from '../pages/Sorting/MergeSort';
import QuickSort from '../pages/Sorting/QuickSort';
import Practice from '../pages/Practice/Practice';
import Progress from '../pages/Progress/Progress';
import CertificatePage from '../pages/Certificate/CertificatePage';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import VerifyOTP from '../pages/Authentication/VerifyOTP';
import ResetPassword from '../pages/Authentication/ResetPassword';
import NotFound from '../pages/NotFound/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'basics', element: <Basics /> },
      { path: 'array', element: <Array /> },
      { path: 'linkedlist', element: <LinkedList /> },
      { path: 'stack', element: <Stack /> },
      { path: 'queue', element: <Queue /> },
      { path: 'circular-queue', element: <CircularQueue /> },
      {
        path: 'searching',
        children: [
          { index: true, element: <Searching /> },
          { path: 'linear', element: <LinearSearch /> },
          { path: 'binary', element: <BinarySearch /> },
        ],
      },
      {
        path: 'sorting',
        children: [
          { index: true, element: <Sorting /> },
          { path: 'bubble', element: <BubbleSort /> },
          { path: 'selection', element: <SelectionSort /> },
          { path: 'insertion', element: <InsertionSort /> },
          { path: 'merge', element: <MergeSort /> },
          { path: 'quick', element: <QuickSort /> },
        ],
      },
      { path: 'practice', element: <Practice /> },
      { path: 'progress', element: <Progress /> },
      { path: 'certificate', element: <CertificatePage /> },
      {
        path: 'auth',
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'verify-otp', element: <VerifyOTP /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);