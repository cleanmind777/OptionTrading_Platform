import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { Navigate, useLocation } from 'react-router-dom';
import { userAtom } from '../atoms/userAtom';
import Cookies from 'js-cookie';
interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const user = useAtomValue(userAtom);
    const location = useLocation();
    const token = Cookies.get('access_token');
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <>{children}</>;
};

export default PrivateRoute;
