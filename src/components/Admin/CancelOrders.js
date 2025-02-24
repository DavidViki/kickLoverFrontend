import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import OrderContext from "../../context/OrderContext";
import Modal from "../Modal";

const CancelOrders = () => {
  const { state, cancelOrder, loading, fetchAllOrders } =
    useContext(OrderContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  // Fetch all orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Handle order cancellation with success/error feedback
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);

      // Show sucess modal
      setModalType("success");
      setModalMessage("Order cancelled!");
      setIsModalOpen(true);

      fetchAllOrders(); // Refresh orders after cancellation
    } catch (error) {
      // Show error modal
      setModalType("error");
      setModalMessage("Failed to cancel order.");
      setIsModalOpen(true);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Display loading spinner if data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 h-screen">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-600"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-screen overflow-hidden"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">
        Cancel Order
      </h2>
      <div className="overflow-x-auto overflow-y-auto max-h-screen">
        <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-1/3 px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="w-1/3 px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Current Status
              </th>
              <th className="w-1/3 px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Cancel Order
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 max-h-screen overflow-y-auto">
            {state.allOrders.map((order) => (
              <motion.tr whileHover={{ scale: 1.02 }} key={order._id}>
                <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {order._id}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <strong>{order.orderStatus}</strong>
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={
                      order.orderStatus === "Cancelled" ||
                      order.orderStatus === "Delivered"
                    }
                    className={`w-full sm:w-auto px-2 py-1 sm:px-4 sm:py-2 rounded ${
                      order.orderStatus !== "Cancelled" &&
                      order.orderStatus !== "Delivered"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Cancel Order
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for error/success */}
      <Modal
        isOpen={isModalOpen}
        type={modalType}
        message={modalMessage}
        onClose={closeModal}
      />
    </motion.div>
  );
};

export default CancelOrders;
