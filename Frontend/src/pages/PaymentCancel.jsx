import React, { useContext, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'sonner';
import axios from 'axios';

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const hasReleased = useRef(false);

    useEffect(() => {
        const releaseSlot = async () => {
            const staffId = searchParams.get('staffId');
            const slotDate = searchParams.get('slotDate');
            const slotTime = searchParams.get('slotTime');

            if (staffId && slotDate && slotTime && !hasReleased.current) {
                hasReleased.current = true;
                try {
                    const { data } = await axios.post(`${backendUrl}/api/user/release-slot`, {
                        staffId,
                        slotDate,
                        slotTime
                    });
                    
                    if (data.success) {
                        toast.info("Payment cancelled. Your selected slot has been immediately released.");
                    }
                } catch (error) {
                    console.error("Error releasing slot automatically:", error);
                }
            } else if (!hasReleased.current) {
                toast.info("Payment cancelled.");
                hasReleased.current = true;
            }

            // Redirect back to home or appointments page after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        };

        releaseSlot();
    }, [searchParams, backendUrl, navigate]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-3xl font-semibold mb-4 text-red-500">Payment Cancelled</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                You have cancelled the checkout process. If you selected a time slot, it has been instantly unlocked for others.
            </p>
            <button 
                onClick={() => navigate('/')}
                className="bg-primary text-white px-8 py-3 rounded-full hover:scale-105 transition-all"
            >
                Return to Home
            </button>
        </div>
    );
};

export default PaymentCancel;
