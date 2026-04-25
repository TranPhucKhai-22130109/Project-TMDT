"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Printer, Edit, Trash2, CheckCircle2, Circle, ArrowRight, Quote } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge.jsx";

const ORDER_STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderDetailPanel({ order, isOpen, onClose, onUpdateStatus }) {
  const [mounted, setMounted] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(order);
  const [updateStatusTo, setUpdateStatusTo] = useState("");

  useEffect(() => {
    if (order) {
      setDisplayOrder(order);
      
      // Auto-select next logical status
      if (order.status !== "Cancelled" && order.status !== "Delivered") {
        const currIdx = ORDER_STATUS_FLOW.indexOf(order.status);
        if (currIdx >= 0 && currIdx < ORDER_STATUS_FLOW.length - 1) {
          setUpdateStatusTo(ORDER_STATUS_FLOW[currIdx + 1]);
        }
      } else {
        setUpdateStatusTo("");
      }
    }
  }, [order]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;
  if (!displayOrder) return null;

  const handleUpdateClick = () => {
    if (updateStatusTo && updateStatusTo !== displayOrder.status) {
      onUpdateStatus(displayOrder.id, updateStatusTo);
    }
  };

  const isCompletedStep = (status) => {
    if (displayOrder.status === "Cancelled") {
      return status === "Cancelled" || displayOrder.timeline.some(t => t.status === status && t.completed);
    }
    const currIdx = ORDER_STATUS_FLOW.indexOf(displayOrder.status);
    const stepIdx = ORDER_STATUS_FLOW.indexOf(status);
    return stepIdx <= currIdx;
  };

  const validNextStatuses = ORDER_STATUS_FLOW.filter((status, idx) => {
    const currIdx = ORDER_STATUS_FLOW.indexOf(displayOrder.status);
    return idx > currIdx;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-250 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* PANEL HEADER */}
        <div className="sticky top-0 bg-white z-10 flex flex-col gap-2 p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 leading-none">{displayOrder.id}</h2>
              <OrderStatusBadge status={displayOrder.status} />
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Created: <span className="text-gray-700 font-medium">{displayOrder.createdAt}</span>
            <span className="mx-2">•</span>
            Last updated: <span className="text-gray-700 font-medium">{displayOrder.updatedAt}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* SECTION 1: Status Timeline */}
          <div className="p-6 py-5 bg-gray-50/50 border-b border-gray-100" style={{ transition: "opacity 300ms 60ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Order Status</h3>
            
            <div className="relative pl-3 space-y-6">
              {/* Timeline Lines */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200"></div>

              {displayOrder.timeline.map((step, idx) => {
                const isCompleted = step.completed;
                const isCurrent = step.status === displayOrder.status;
                const isCancelled = step.status === "Cancelled";
                
                return (
                  <div key={idx} className="relative flex items-start gap-4 z-10">
                    <div className="relative shrink-0 w-6 h-6 flex items-center justify-center bg-white">
                      {isCompleted ? (
                        <CheckCircle2 className={`w-6 h-6 ${isCancelled ? 'text-red-500' : 'text-indigo-600'} bg-white`} />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 bg-white" />
                      )}
                      
                      {/* Pulse animation for current active step */}
                      {isCurrent && !isCancelled && displayOrder.status !== "Delivered" && (
                        <span className="absolute inset-0 rounded-full border-2 border-indigo-600 animate-ping opacity-25"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 pt-0.5">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className={`font-bold ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                        {step.timestamp && (
                          <span className="text-xs font-medium text-gray-500">{step.timestamp}</span>
                        )}
                      </div>
                      <p className={`text-sm ${isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Update Status Bar */}
            {displayOrder.status !== "Cancelled" && displayOrder.status !== "Delivered" && (
              <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Update Status:</span>
                <div className="flex items-center gap-2">
                  <select 
                    value={updateStatusTo} 
                    onChange={(e) => setUpdateStatusTo(e.target.value)}
                    className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {validNextStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleUpdateClick}
                    disabled={!updateStatusTo}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Order Items */}
          <div className="p-6 py-5 border-b border-gray-100" style={{ transition: "opacity 300ms 120ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Order Items</h3>
            
            <div className="border border-gray-100 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium text-center">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">Price</th>
                    <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {displayOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.productName} className="w-10 h-10 rounded object-cover bg-gray-50" />
                          <div>
                            <div className="font-semibold text-gray-900">{item.productName}</div>
                            <div className="text-gray-400 text-xs">{item.productId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-gray-600">${item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">${item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Breakdown */}
            <div className="flex justify-end mb-4">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${displayOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>${displayOrder.shippingFee.toLocaleString()}</span>
                </div>
                {displayOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-${displayOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-indigo-600">${displayOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Tags */}
            <div className="flex justify-end gap-2 items-center">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                {displayOrder.paymentMethod}
              </span>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
                displayOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                displayOrder.paymentStatus === 'Refunded' ? 'bg-gray-200 text-gray-700' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {displayOrder.paymentStatus}
              </span>
            </div>
          </div>

          {/* SECTION 3: Customer & Shipping */}
          <div className="p-6 py-5 border-b border-gray-100" style={{ transition: "opacity 300ms 180ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Customer & Shipping</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer */}
              <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={displayOrder.customer.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-gray-100" />
                  <div>
                    <div className="font-bold text-gray-900">{displayOrder.customer.name}</div>
                    <div className="text-gray-500 text-xs">{displayOrder.customer.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">{displayOrder.customer.phone}</div>
                <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  View Customer <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Shipping */}
              <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {displayOrder.shippingAddress.street}<br/>
                    {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.province} {displayOrder.shippingAddress.zip}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-3 bg-gray-50 p-2 rounded">
                  Courier: GHN Express
                </div>
                <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  Track Shipment <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4: Customer Note */}
          {displayOrder.note && (
            <div className="p-6 py-5 pb-6" style={{ transition: "opacity 300ms 240ms", opacity: isOpen ? 1 : 0 }}>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Customer Note</h3>
              <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg flex items-start gap-3">
                <Quote className="w-5 h-5 text-yellow-500 shrink-0 opacity-50" />
                <p className="text-sm text-yellow-900 italic leading-relaxed">
                  "{displayOrder.note}"
                </p>
              </div>
            </div>
          )}

        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 bg-white z-10 border-t border-gray-200 p-4 flex items-center justify-between shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          
          <div className="flex gap-2">
            {displayOrder.status !== "Delivered" && displayOrder.status !== "Cancelled" && (
              <button 
                onClick={() => onUpdateStatus(displayOrder.id, "Cancelled")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
              >
                Cancel Order
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
              <Edit className="w-4 h-4" />
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
