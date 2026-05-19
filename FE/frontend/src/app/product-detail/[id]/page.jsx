"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  Menu,
  Sun,
  Moon,
  Search,
  ShoppingCart,
  User,
  Zap,
  Flame,
  Store,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import NextLink from "next/link";
import { getProducts } from "@/services/productService";
import { Text } from "@/components/Text";
import { Navbar } from "@/components/Navbar";
import { addToCart } from "@/services/cartService";
import { useCart } from "@/app/cart/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  getProductComments,
  createProductComment,
  replyProductComment,
  updateProductComment,
  deleteProductComment,
} from "@/services/commentService";

import {
  MoreVertical,
  MessageCircle,
  Send,
  Trash2,
  Pencil,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  // States cho trang chi tiết
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // States cho Navbar (mobile menu & dark mode)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addGuestCart, reloadCartCount } = useCart();

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await addToCart(product.id, quantity);
        await reloadCartCount();
      } else {
        addGuestCart(product, quantity);
      }

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const loadComments = async () => {
    try {
      const data = await getProductComments(params.id);
      setComments(data);
    } catch (error) {
      console.error("Lỗi tải bình luận:", error);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadComments();
    }
  }, [params.id]);

  const handleCreateComment = async () => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }

    if (!commentContent.trim()) return;

    try {
      await createProductComment(params.id, commentContent);
      setCommentContent("");
      await loadComments();
    } catch (error) {
      console.error(error);
      alert("Bình luận thất bại!");
    }
  };

  const handleReplyComment = async (commentId) => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để trả lời!");
      return;
    }

    if (!replyContent.trim()) return;

    try {
      await replyProductComment(params.id, commentId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
      await loadComments();
    } catch (error) {
      console.error(error);
      alert("Trả lời thất bại!");
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) return;

    try {
      await updateProductComment(params.id, commentId, editingContent);
      setEditingCommentId(null);
      setEditingContent("");
      await loadComments();
    } catch (error) {
      console.error(error);
      alert("Cập nhật bình luận thất bại!");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Bạn có chắc muốn xoá bình luận này không?")) return;

    try {
      await deleteProductComment(params.id, commentId);
      await loadComments();
    } catch (error) {
      console.error(error);
      alert("Xoá bình luận thất bại!");
    }
  };

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();

        const foundProduct = allProducts.find(
          (p) => String(p.id) === String(params.id),
        );

        if (foundProduct) {
          setProduct({
            ...foundProduct,
            images: foundProduct.images || [
              foundProduct.imageUrl,
              foundProduct.imageUrl,
              foundProduct.imageUrl,
            ],
          });
          setActiveImage(0);
        } else {
          router.push("/products");
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductDetail();
    }
  }, [params.id, router]);

  const handleQuantityChange = (type) => {
    if (type === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    if (type === "plus") setQuantity((prev) => prev + 1);
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-red-600">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {Navbar && <Navbar />}

      {/* ==================== PRODUCT DETAIL CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <NextLink
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 mb-8 font-medium"
        >
          ← Quay lại cửa hàng
        </NextLink>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] flex items-center justify-center border border-gray-100 dark:border-gray-700">
              <img
                src={product.images[activeImage] || product.imageUrl}
                alt={product.name}
                className="max-h-[520px] w-auto object-contain p-8"
              />
              <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-full font-bold shadow-lg">
                {product.status || "Released"}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    activeImage === index
                      ? "border-red-600 shadow-md"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Hình ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-4 py-1.5 rounded-full">
                  {product.status || "Released"}
                </span>
                <span className="text-sm text-gray-500">
                  Item No: {product.itemNo}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                {product.name}
              </h1>

              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                Scale: {product.scale} • {product.marque}
              </p>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-red-600">
                {Number(product.price || 0).toLocaleString("vi-VN")} ₫
              </span>
              {product.originalPrice && (
                <span className="text-2xl line-through text-gray-400">
                  {Number(product.price || 0).toLocaleString("vi-VN")} ₫
                </span>
              )}
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || "Mô hình xe chất lượng cao từ MINI GT."}
            </p>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold mb-3">Số lượng</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-2xl w-fit bg-white dark:bg-gray-800">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-7 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-2xl"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-12 font-bold text-2xl min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-7 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-2xl"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button
              onClick={() => {
                handleAddToCart(product, quantity);
              }}
              className="w-full py-8 text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              Thêm vào giỏ hàng —{" "}
              {Number(product.price || 0).toLocaleString("vi-VN")} ₫
            </Button>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex items-center justify-center gap-3"
              >
                <Heart
                  className={`w-6 h-6 mr-3 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`}
                />
                Yêu thích
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 "
              >
                <Share2 className="w-6 h-6 mr-3" />
                Chia sẻ
              </Button>
            </div>
            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    {product.sellerAvatar ? (
                      <img
                        src={product.sellerAvatar}
                        alt={product.sellerName || "Seller"}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Store className="w-7 h-7 text-red-600" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Người bán
                    </p>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {product.sellerName || "Official Seller"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Seller ID: {product.sellerId || "N/A"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      📞 {product.sellerPhoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <ShieldCheck className="w-4 h-4" />
                  Đã xác minh
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
                  <p className="text-xs text-gray-500">Sản phẩm</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Đang bán
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <PackageCheck className="w-4 h-4" />
                    Có sẵn
                  </p>
                </div>
              </div>

              <button className="mt-5 w-full py-3 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                Xem shop
              </button>
            </div>
          </div>
        </div>

        {/* ==================== PRODUCT COMMENTS ==================== */}
        <div className="mt-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Hỏi đáp về sản phẩm
            </h2>
          </div>

          <div className="flex gap-3 mb-8">
            <input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Đặt câu hỏi về sản phẩm này..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-red-500"
            />

            <button
              onClick={handleCreateComment}
              className="px-5 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Gửi
            </button>
          </div>

          <div className="space-y-5">
            {comments.filter((c) => !c.parentId).length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Chưa có câu hỏi nào cho sản phẩm này.
              </p>
            )}

            {comments
              .filter((c) => !c.parentId)
              .map((comment) => {
                const replies = comments.filter(
                  (r) => r.parentId === comment.id,
                );

                return (
                  <div
                    key={comment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <img
                        src={comment.userAvatar || "/default-avatar.png"}
                        alt={comment.username}
                        className="w-11 h-11 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {comment.username}
                        </p>

                        {editingCommentId === comment.id ? (
                          <div className="mt-2 flex gap-2">
                            <input
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              className="flex-1 px-3 py-2 rounded-xl border dark:bg-gray-900 dark:text-white"
                            />
                            <button
                              onClick={() => handleUpdateComment(comment.id)}
                              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700"
                            >
                              Huỷ
                            </button>
                          </div>
                        ) : (
                          <p className="mt-1 text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        )}
                      </div>

                      {comment.isOwner && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === comment.id ? null : comment.id,
                              )
                            }
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openMenuId === comment.id && (
                            <div className="absolute right-0 top-10 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <Pencil className="w-4 h-4" />
                                Sửa
                              </button>

                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xoá
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id,
                        )
                      }
                      className="mt-3 text-sm font-bold text-red-600 hover:underline"
                    >
                      Reply
                    </button>

                    {replyingTo === comment.id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Viết câu trả lời..."
                          className="flex-1 px-3 py-2 rounded-xl border dark:bg-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleReplyComment(comment.id)}
                          className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
                        >
                          Gửi
                        </button>
                      </div>
                    )}

                    {replies.length > 0 && (
                      <div className="mt-5 ml-6 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                        {replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex gap-3"
                          >
                            <img
                              src={reply.userAvatar || "/default-avatar.png"}
                              alt={reply.username}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />

                            <div className="flex-1">
                              <div className="flex justify-between gap-3">
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900 dark:text-white">
                                    {reply.username}
                                  </p>

                                  {editingCommentId === reply.id ? (
                                    <div className="mt-2 flex gap-2">
                                      <input
                                        value={editingContent}
                                        onChange={(e) =>
                                          setEditingContent(e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 rounded-xl border dark:bg-gray-900 dark:text-white"
                                      />

                                      <button
                                        onClick={() =>
                                          handleUpdateComment(reply.id)
                                        }
                                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
                                      >
                                        Lưu
                                      </button>

                                      <button
                                        onClick={() =>
                                          setEditingCommentId(null)
                                        }
                                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700"
                                      >
                                        Huỷ
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                      {reply.content}
                                    </p>
                                  )}
                                </div>

                                {reply.isOwner && (
                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setOpenMenuId(
                                          openMenuId === reply.id
                                            ? null
                                            : reply.id,
                                        )
                                      }
                                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {openMenuId === reply.id && (
                                      <div className="absolute right-0 top-10 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(reply.id);
                                            setEditingContent(reply.content);
                                            setOpenMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                          <Pencil className="w-4 h-4" />
                                          Sửa
                                        </button>

                                        <button
                                          onClick={() =>
                                            handleDeleteComment(reply.id)
                                          }
                                          className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          Xoá
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
