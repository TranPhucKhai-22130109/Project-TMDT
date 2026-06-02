"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User as UserIcon,
  MapPin,
  KeyRound,
  Camera,
  Plus,
  Trash2,
  Edit2,
  Check,
  Loader2,
  CheckCircle,
  AlertCircle,
  Package,
  Search,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  getUserProfileById
} from "@/services/userService";
import { getAllProducts } from "@/services/sellerProductService";
import { getProductsBySellerId } from "@/services/productService";

function UserProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("sellerId");
  const isViewOnly = !!sellerId;

  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  // Profile States
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("Nam");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Avatar upload states
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Address book states
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [city, setCity] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Seller products states
  const [sellerProducts, setSellerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [scaleFilter, setScaleFilter] = useState("all");
  const [marqueFilter, setMarqueFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'buy-now', 'auction'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'price-asc', 'price-desc', 'sold-desc'

  // UI Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load User Profile
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = isViewOnly ? await getUserProfileById(sellerId) : await getMyProfile();
      setProfile(data);
      setFullName(data.fullName || "");
      setPhoneNumber(data.phoneNumber || "");
      setGender(data.gender || "Nam");
      setDateOfBirth(data.dateOfBirth || "");
      setAvatarUrl(data.avatarUrl || "");
    } catch (err) {
      console.error(err);
      showToast("Không thể tải thông tin hồ sơ", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  // Load User Addresses
  const fetchAddresses = async () => {
    if (isViewOnly) return;
    try {
      setAddressesLoading(true);
      const list = await getMyAddresses();
      setAddresses(list);
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách địa chỉ", "error");
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, sellerId, isViewOnly]);

  useEffect(() => {
    setActiveTab("personal");
  }, [sellerId]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "addresses") {
      fetchAddresses();
    }
  }, [isAuthenticated, activeTab]);

  // Load Seller Products
  const fetchSellerProducts = async () => {
    try {
      setProductsLoading(true);
      const data = isViewOnly ? await getProductsBySellerId(sellerId) : await getAllProducts();
      setSellerProducts(data || []);
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách sản phẩm", "error");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "my-products") {
      fetchSellerProducts();
    }
  }, [isAuthenticated, activeTab]);

  // Extract unique marques and scales from products
  const availableMarques = ["all", ...new Set(sellerProducts.map(p => p.marque).filter(Boolean))];
  const availableScales = ["all", ...new Set(sellerProducts.map(p => p.scale).filter(Boolean))];

  // In-memory filtering and sorting
  const filteredProducts = sellerProducts
    .filter(p => {
      const matchesSearch = !productSearch || 
                            p.name?.toLowerCase().includes(productSearch.toLowerCase()) || 
                            p.itemNo?.toLowerCase().includes(productSearch.toLowerCase());
      const matchesScale = scaleFilter === "all" || p.scale === scaleFilter;
      const matchesMarque = marqueFilter === "all" || p.marque === marqueFilter;
      const matchesType = typeFilter === "all" || 
                          (typeFilter === "auction" && p.isAuction) || 
                          (typeFilter === "buy-now" && !p.isAuction);
      return matchesSearch && matchesScale && matchesMarque && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "sold-desc") return b.soldQuantity - a.soldQuantity;
      return b.id - a.id; // default: newest
    });

  // Handle Avatar Change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Kích thước file ảnh không được quá 2MB", "error");
      return;
    }

    try {
      setUploading(true);
      const userId = localStorage.getItem("localstorage-userId") || "anonymous";
      const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          showToast("Upload ảnh lên Firebase thất bại", "error");
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          // Cập nhật URL lên Backend database
          await updateMyProfile({ avatarUrl: downloadUrl });
          setAvatarUrl(downloadUrl);
          showToast("Cập nhật ảnh đại diện thành công!");
          setUploading(false);
        }
      );
    } catch (err) {
      console.error(err);
      showToast("Đã xảy ra lỗi khi đổi ảnh đại diện", "error");
      setUploading(false);
    }
  };

  // Save Profile Info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const updated = await updateMyProfile({
        fullName,
        phoneNumber,
        gender,
        dateOfBirth
      });
      setProfile(updated);
      showToast("Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      console.error(err);
      showToast("Cập nhật thông tin thất bại", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  // Open Address Modal for Create or Edit
  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setReceiverName(address.receiverName);
      setReceiverPhone(address.receiverPhone);
      setAddressDetails(address.addressDetails);
      setCity(address.city);
      setIsDefault(address.isDefault);
    } else {
      setEditingAddress(null);
      setReceiverName("");
      setReceiverPhone("");
      setAddressDetails("");
      setCity("");
      setIsDefault(addresses.length === 0); // Tự động chọn mặc định nếu chưa có địa chỉ nào
    }
    setAddressModalOpen(true);
  };

  // Save/Update Address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!receiverName || !receiverPhone || !addressDetails || !city) {
      showToast("Vui lòng điền đầy đủ các thông tin địa chỉ", "error");
      return;
    }

    try {
      setAddressesLoading(true);
      const payload = { receiverName, receiverPhone, addressDetails, city, isDefault };
      
      if (editingAddress) {
        await updateMyAddress(editingAddress.id, payload);
        showToast("Cập nhật địa chỉ thành công!");
      } else {
        await addMyAddress(payload);
        showToast("Thêm địa chỉ mới thành công!");
      }
      setAddressModalOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showToast("Lưu địa chỉ thất bại", "error");
    } finally {
      setAddressesLoading(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      setAddressesLoading(true);
      await deleteMyAddress(addressId);
      showToast("Đã xóa địa chỉ thành công!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showToast("Xóa địa chỉ thất bại", "error");
    } finally {
      setAddressesLoading(false);
    }
  };

  // Set Address As Default Quick Action
  const handleSetDefaultAddress = async (address) => {
    try {
      setAddressesLoading(true);
      await updateMyAddress(address.id, { ...address, isDefault: true });
      showToast("Đã đặt địa chỉ làm mặc định!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showToast("Thiết lập địa chỉ mặc định thất bại", "error");
    } finally {
      setAddressesLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Vui lòng nhập đầy đủ các trường mật khẩu", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu mới và mật khẩu xác nhận không trùng khớp", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Mật khẩu mới phải có tối thiểu 6 ký tự", "error");
      return;
    }

    try {
      setProfileLoading(true);
      await changeMyPassword({ currentPassword, newPassword });
      showToast("Thay đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      showToast("Mật khẩu hiện tại không chính xác", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
        <Navbar />

        {/* TOAST ALERT */}
        {toast && (
          <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border text-white transition-all duration-300 ${
            toast.type === "success" ? "bg-emerald-600 border-emerald-500 shadow-emerald-950/20" : "bg-rose-600 border-rose-500 shadow-rose-950/20"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        )}

        <div className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* SIDEBAR */}
            <aside className="w-full md:w-80 shrink-0 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 self-start transition-all">
              <div className="flex flex-col items-center pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
                <div 
                  onClick={() => !isViewOnly && !uploading && fileInputRef.current?.click()}
                  className={`relative group ${isViewOnly ? "" : "cursor-pointer"}`}
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-50 dark:border-indigo-950 shadow-md">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
                        {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : (profile?.username ? profile.username.charAt(0).toUpperCase() : "U")}
                      </div>
                    )}
                  </div>
                  
                  {!isViewOnly && (
                    <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {uploading ? (
                        <Loader2 className="w-7 h-7 text-white animate-spin" />
                      ) : (
                        <Camera className="w-7 h-7 text-white" />
                      )}
                    </div>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />

                <h2 className="mt-4 font-extrabold text-gray-900 dark:text-white text-xl">
                  {profile?.fullName || profile?.username || "Người dùng"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">@{profile?.username}</p>
                {profile?.roles && profile.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {profile.roles.map((role) => (
                      <div key={role} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {role} Account
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                    User Account
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === "personal"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <UserIcon className="w-5 h-5 shrink-0" />
                  {isViewOnly ? "Thông tin người bán" : "Thông tin cá nhân"}
                </button>

                {!isViewOnly && !profile?.roles?.includes("SELLER") && (
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                      activeTab === "addresses"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <MapPin className="w-5 h-5 shrink-0" />
                    Sổ địa chỉ nhận hàng
                  </button>
                )}

                {!isViewOnly && (
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                      activeTab === "security"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <KeyRound className="w-5 h-5 shrink-0" />
                    Đổi mật khẩu bảo mật
                  </button>
                )}

                {(isViewOnly || (profile?.roles && (profile.roles.includes("SELLER") || profile.roles.includes("ADMIN")))) && (
                  <button
                    onClick={() => setActiveTab("my-products")}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                      activeTab === "my-products"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Package className="w-5 h-5 shrink-0" />
                    {isViewOnly ? "Sản phẩm của Shop" : "Sản phẩm của tôi"}
                  </button>
                )}
              </nav>
            </aside>

            {/* MAIN PANELS CONTAINER */}
            <main className="flex-1 bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[550px] transition-all">
              
              {/* TAB 1: PERSONAL INFORMATION */}
              {activeTab === "personal" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                    {isViewOnly ? "Thông tin người bán" : "Thông tin cá nhân"}
                  </h3>

                  {profileLoading && !profile ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên hiển thị</label>
                          <input 
                            type="text" 
                            disabled 
                            value={profile?.username || ""} 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 cursor-not-allowed font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Địa chỉ Email</label>
                          <input 
                            type="email" 
                            disabled 
                            value={profile?.email || ""} 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 cursor-not-allowed font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Họ & Tên của bạn</label>
                          <input 
                            type="text" 
                            disabled={isViewOnly}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập đầy đủ họ và tên"
                            className={`w-full px-4 py-3 rounded-xl border font-medium transition-all ${
                              isViewOnly 
                                ? "bg-gray-50 dark:bg-gray-950/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 cursor-not-allowed" 
                                : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Số điện thoại liên hệ</label>
                          <input 
                            type="text" 
                            disabled={isViewOnly}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Nhập số điện thoại của bạn"
                            className={`w-full px-4 py-3 rounded-xl border font-medium transition-all ${
                              isViewOnly 
                                ? "bg-gray-50 dark:bg-gray-950/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 cursor-not-allowed" 
                                : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Giới tính</label>
                          <div className="flex gap-4">
                            {["Nam", "Nữ", "Khác"].map((g) => (
                              <label 
                                key={g} 
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all ${
                                  isViewOnly 
                                    ? "bg-gray-50 dark:bg-gray-950/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 cursor-not-allowed" 
                                    : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/55"
                                }`}
                              >
                                <input 
                                  type="radio" 
                                  name="gender" 
                                  value={g} 
                                  checked={gender === g}
                                  disabled={isViewOnly}
                                  onChange={() => setGender(g)}
                                  className={`text-indigo-600 focus:ring-indigo-500 ${isViewOnly ? "cursor-not-allowed" : ""}`} 
                                />
                                {g}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Ngày sinh</label>
                          <input 
                            type="date" 
                            disabled={isViewOnly}
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border font-medium transition-all ${
                              isViewOnly 
                                ? "bg-gray-50 dark:bg-gray-950/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 cursor-not-allowed" 
                                : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none"
                            }`}
                          />
                        </div>
                      </div>

                      {!isViewOnly && (
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                          <button
                            type="submit"
                            disabled={profileLoading}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/15"
                          >
                            {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Lưu thông tin cá nhân
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: ADDRESS BOOK */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Sổ địa chỉ nhận hàng
                    </h3>
                    <button
                      onClick={() => openAddressModal()}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/15"
                    >
                      <Plus className="w-4 h-4" /> Add Address
                    </button>
                  </div>

                  {addressesLoading && addresses.length === 0 ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="font-semibold text-sm">Chưa lưu địa chỉ giao hàng nào</p>
                      <p className="text-xs text-gray-400 mt-1">Vui lòng thêm địa chỉ để thuận tiện hơn khi mua sắm.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                            address.isDefault 
                              ? "border-indigo-600 bg-indigo-50/15 dark:bg-indigo-950/10" 
                              : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-gray-900 dark:text-white text-base">{address.receiverName}</span>
                              {address.isDefault && (
                                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                  <Check className="w-3 h-3" /> Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{address.receiverPhone}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                              {address.addressDetails}, {address.city}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800/45 pt-3">
                            <button
                              onClick={() => openAddressModal(address)}
                              className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Xóa
                            </button>
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address)}
                                className="ml-auto text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                Đặt mặc định
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CHANGE PASSWORD */}
              {activeTab === "security" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                    Đổi mật khẩu bảo mật
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Mật khẩu hiện tại</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu tối thiểu 6 ký tự"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">Xác nhận mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none font-medium"
                      />
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/15"
                      >
                        {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: MY PRODUCTS (SELLER ONLY) */}
              {activeTab === "my-products" && (
                <div>
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      Sản phẩm của tôi
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Quản lý và lọc nhanh danh sách các mặt hàng xe mô hình bạn đang kinh doanh.
                    </p>
                  </div>

                  {/* QUICK STATS PANEL */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/75">
                      <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {sellerProducts.length}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                        Tổng sản phẩm
                      </span>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/75">
                      <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {sellerProducts.filter(p => !p.isAuction).length}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                        Đang bán (Mua ngay)
                      </span>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/75">
                      <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                        {sellerProducts.filter(p => p.isAuction).length}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                        Đang Đấu giá
                      </span>
                    </div>
                  </div>

                  {/* FILTER CONTROLLER BAR */}
                  <div className="bg-gray-50/30 dark:bg-gray-800/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Search */}
                      <div className="relative col-span-1 sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                          Tìm kiếm sản phẩm
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Nhập tên sản phẩm, mã xe..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none text-sm font-medium"
                          />
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Filter Scale */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                          Tỉ lệ (Scale)
                        </label>
                        <select 
                          value={scaleFilter}
                          onChange={(e) => setScaleFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none text-sm font-medium"
                        >
                          <option value="all">Tất cả tỉ lệ</option>
                          {availableScales.filter(s => s !== "all").map(scale => (
                            <option key={scale} value={scale}>{scale}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filter Marque */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                          Hãng xe (Marque)
                        </label>
                        <select 
                          value={marqueFilter}
                          onChange={(e) => setMarqueFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none text-sm font-medium"
                        >
                          <option value="all">Tất cả hãng xe</option>
                          {availableMarques.filter(m => m !== "all").map(marque => (
                            <option key={marque} value={marque}>{marque}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filter Method */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                          Cách bán
                        </label>
                        <select 
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none text-sm font-medium"
                        >
                          <option value="all">Tất cả hình thức</option>
                          <option value="buy-now">Mua ngay (Buy Now)</option>
                          <option value="auction">Đấu giá (Auction)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                        Hiển thị <strong className="text-gray-700 dark:text-gray-300">{filteredProducts.length}</strong> / {sellerProducts.length} sản phẩm
                      </span>

                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <ArrowUpDown className="w-3 h-3" /> Sắp xếp
                        </label>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none text-xs font-semibold"
                        >
                          <option value="newest">Mới đăng bán</option>
                          <option value="price-asc">Giá: Thấp đến Cao</option>
                          <option value="price-desc">Giá: Cao đến Thấp</option>
                          <option value="sold-desc">Bán chạy nhất</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS GRID */}
                  {productsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                      <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="font-semibold text-sm">Không tìm thấy sản phẩm phù hợp</p>
                      <p className="text-xs text-gray-400 mt-1">Vui lòng thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <div 
                          key={product.id}
                          className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                        >
                          {/* PRODUCT IMAGE */}
                          <div className="h-44 bg-gray-50 dark:bg-gray-950/65 relative flex items-center justify-center overflow-hidden border-b border-gray-50 dark:border-gray-800/40">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700 bg-gray-100 dark:bg-gray-900 text-sm font-bold uppercase tracking-wider">
                                No Image
                              </div>
                            )}

                            {/* BADGES */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                              {product.isAuction ? (
                                <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-md shadow-sm">
                                  Đấu giá
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-md shadow-sm">
                                  Mua ngay
                                </span>
                              )}
                              
                              {product.scale && (
                                <span className="px-2 py-0.5 bg-indigo-500/10 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold rounded-md border border-indigo-100/35 uppercase tracking-wider self-start">
                                  Tỉ lệ {product.scale}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* PRODUCT DETAILS */}
                          <div className="p-4 flex flex-col flex-1 justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                {product.marque && (
                                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md">
                                    {product.marque}
                                  </span>
                                )}
                                {product.itemNo && (
                                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase">
                                    #{product.itemNo}
                                  </span>
                                )}
                              </div>
                              
                              <h4 className="font-extrabold text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {product.name}
                              </h4>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                              <div>
                                <span className="block text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                                  {product.isAuction ? "Giá hiện tại" : "Đơn giá"}
                                </span>
                                <span className="text-sm font-black text-rose-600 dark:text-rose-500">
                                  {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="block text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                                  Kho: <strong className="text-gray-700 dark:text-gray-300">{product.stockQuantity}</strong>
                                </span>
                                <span className="block text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                                  Đã bán: <strong className="text-gray-700 dark:text-gray-300">{product.soldQuantity}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </main>
          </div>
        </div>

        {/* ADDRESS POPUP/MODAL */}
        {addressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/45 dark:bg-gray-800/15">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ giao hàng mới"}
                </h4>
                <button 
                  onClick={() => setAddressModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ & Tên người nhận</label>
                    <input 
                      type="text" 
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Nhập tên người nhận"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số điện thoại nhận</label>
                    <input 
                      type="text" 
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tỉnh / Thành phố</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ví dụ: TP. Hồ Chí Minh"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Địa chỉ cụ thể</label>
                  <input 
                    type="text" 
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-sm font-medium"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <input 
                    type="checkbox" 
                    id="address-default"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    disabled={editingAddress?.isDefault} // Không cho phép bỏ tích nếu đây đang là mặc định duy nhất
                    className="h-4.5 w-4.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="address-default" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    Đặt địa chỉ này làm mặc định
                  </label>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/15"
                  >
                    Xác nhận lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Đang tải...</p>
        </div>
      </div>
    }>
      <UserProfilePageContent />
    </Suspense>
  );
}
