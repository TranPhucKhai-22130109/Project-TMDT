"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Camera, Loader2, CheckCircle, AlertCircle, Store, Phone, FileText } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import { getMyShop, updateMyShop, updateMyProfile } from "@/services/userService";

export default function SellerProfilePage() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [shopCoverUrl, setShopCoverUrl] = useState("");

  // Upload progress indicators
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // UI Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Shop Profile
  const fetchShopProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyShop();
      setShop(data);
      setShopName(data.shopName || "");
      setShopDescription(data.shopDescription || "");
      setPhoneNumber(data.phoneNumber || "");
      setAvatarUrl(data.avatarUrl || "");
      setShopCoverUrl(data.shopCoverUrl || "");
    } catch (err) {
      console.error(err);
      showToast("Không thể tải thông tin hồ sơ Shop", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopProfile();
  }, []);

  // Handle Logo Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Kích thước logo không được vượt quá 2MB", "error");
      return;
    }

    try {
      setUploadingLogo(true);
      const sellerId = shop?.id || "seller";
      const storageRef = ref(storage, `shops/logos/${sellerId}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload logo error:", error);
          showToast("Upload logo lên Firebase thất bại", "error");
          setUploadingLogo(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          // Cập nhật cả avatar chính của user
          await updateMyProfile({ avatarUrl: downloadUrl });
          setAvatarUrl(downloadUrl);
          showToast("Cập nhật Logo Shop thành công!");
          setUploadingLogo(false);
        }
      );
    } catch (err) {
      console.error(err);
      showToast("Lỗi thay đổi logo shop", "error");
      setUploadingLogo(false);
    }
  };

  // Handle Cover Photo Upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast("Kích thước ảnh bìa không được vượt quá 4MB", "error");
      return;
    }

    try {
      setUploadingCover(true);
      const sellerId = shop?.id || "seller";
      const storageRef = ref(storage, `shops/covers/${sellerId}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload cover error:", error);
          showToast("Upload ảnh bìa lên Firebase thất bại", "error");
          setUploadingCover(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await updateMyShop({ shopCoverUrl: downloadUrl });
          setShopCoverUrl(downloadUrl);
          showToast("Cập nhật ảnh bìa Shop thành công!");
          setUploadingCover(false);
        }
      );
    } catch (err) {
      console.error(err);
      showToast("Lỗi thay đổi ảnh bìa shop", "error");
      setUploadingCover(false);
    }
  };

  // Handle Save Shop Info
  const handleSaveShop = async (e) => {
    e.preventDefault();
    if (!shopName) {
      showToast("Tên Shop không được bỏ trống", "error");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateMyShop({
        shopName,
        shopDescription
      });
      // Cập nhật số điện thoại cá nhân (liên hệ của shop)
      if (phoneNumber) {
        await updateMyProfile({ phoneNumber });
      }
      setShop({ ...shop, ...updated });
      showToast("Lưu thông tin cửa hàng thành công!");
    } catch (err) {
      console.error(err);
      showToast("Không thể lưu thông tin cửa hàng", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Hồ sơ Cửa hàng">
        <div className="max-w-[1200px] mx-auto pb-12 relative">
          
          {/* TOAST ALERT */}
          {toast && (
            <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border text-white transition-all duration-300 ${
              toast.type === "success" ? "bg-emerald-600 border-emerald-500 shadow-emerald-950/20" : "bg-rose-600 border-rose-500 shadow-rose-950/20"
            }`}>
              {toast.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-semibold">{toast.message}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* SHOP BANNER & COVER CONTEXT */}
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
                
                {/* COVER IMAGE */}
                <div className="h-64 sm:h-80 bg-gradient-to-r from-indigo-500 to-purple-600 relative group overflow-hidden">
                  {shopCoverUrl ? (
                    <img src={shopCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm font-medium">
                      Chưa chọn ảnh bìa Shop (Khuyên dùng tỷ lệ 16:9)
                    </div>
                  )}

                  <button
                    onClick={() => !uploadingCover && coverInputRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    {uploadingCover ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-800" />
                    ) : (
                      <Camera className="w-4 h-4 text-gray-800" />
                    )}
                    Thay đổi ảnh bìa
                  </button>
                  
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* LOGO & QUICK STATS ROW */}
                <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative">
                  
                  {/* LOGO (AVATAR) */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 sm:-mt-20 z-10">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white text-4xl font-black">
                            {shopName ? shopName.charAt(0).toUpperCase() : "S"}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                        className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        {uploadingLogo ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </button>

                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="text-center sm:text-left">
                      <h1 className="text-2xl font-black text-gray-900">{shopName || "Tên Shop của bạn"}</h1>
                      <p className="text-sm text-gray-500 mt-1">@{shop?.username}</p>
                    </div>
                  </div>

                  {/* QUICK STATS */}
                  <div className="flex items-center gap-4 self-center sm:self-end">
                    <div className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="block text-lg font-black text-gray-900">{shop?.email ? "Email" : "N/A"}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{shop?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROFILE FORM */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                  <Store className="w-5 h-5 text-indigo-600" />
                  Cấu hình thông tin cửa hàng
                </h3>

                <form onSubmit={handleSaveShop} className="space-y-6 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tên hiển thị của Cửa hàng (Shop Name)</label>
                      <input 
                        type="text" 
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Nhập tên hiển thị của Shop (ví dụ: Blitz Model Shop)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Hotline hỗ trợ Khách hàng
                      </label>
                      <input 
                        type="text" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Nhập số điện thoại liên hệ"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tài khoản Email kết nối</label>
                      <input 
                        type="email" 
                        disabled 
                        value={shop?.email || ""} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Giới thiệu / Mô tả về Shop của bạn
                      </label>
                      <textarea 
                        rows={5}
                        value={shopDescription}
                        onChange={(e) => setShopDescription(e.target.value)}
                        placeholder="Viết lời chào hoặc giới thiệu về nguồn gốc sản phẩm, chất lượng dịch vụ của Shop để thu hút người mua..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/15"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Lưu cấu hình Shop
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
