import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [cars, setCars] = useState([]);

    // function to check if user is logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(data.user);
            setIsOwner(data.user.role === 'owner');
        } catch (error) {
            console.error("Error fetching user:", error?.response?.data || error.message);
        }
    };
    // useEffect to retrieve the token from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // useEffect to fetch user data when token is available
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        }
    }, [token]);

    // function to fetch cars
    const fetchCars = async () => {
        try {
            const { data } = await axios.get("/api/user/cars");
            data.success ? setCars(data.cars) : toast.error(data.message);
        } catch (error) {
            console.error("Error fetching cars:", error?.response?.data || error.message);
            setCars([]); // Set empty array on error
        }
    };

    // function to logout 
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsOwner(false);
        navigate("/");
        axios.defaults.headers.common["Authorization"] = "";
        toast.success("Logged out successfully");
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
        // Fetch cars on initial load regardless of auth status
        fetchCars();
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        }
    }, [token]);

    const value = {
        navigate,
        currency,
        axios,
        user,
        setUser,
        token,
        setToken,
        isOwner,
        setIsOwner,
        showLogin,
        setShowLogin,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        cars,
        setCars,
        fetchUser,
        fetchCars,
        logout,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook: useAppContext
export const useAppContext = () => {
    return useContext(AppContext);
};
