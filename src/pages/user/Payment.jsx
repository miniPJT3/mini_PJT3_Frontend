import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // axios는 이제 paymentApi 및 productApi 내부에서 관리됨
import { paymentApi } from '../../api/paymentApi';
import { productApi } from '../../api/productApi'; // productApi import

const Payment = () => {
    const navigate = useNavigate();
    
    // 🥊 상태 관리: DB에서 가져온 상품들을 저장
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [orderer, setOrderer] = useState({ name: '', email: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    // 🥊 1. 컴포넌트 마운트 시 백엔드에서 상품 6개 로드
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // 백엔드 상품 조회 API 호출
                const response = await productApi.getProducts(); 
                setProducts(response.data);
            } catch (error) {
                console.error("상품 목록 로드 실패:", error);
                alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 🥊 2. 입력값 검증 로직
    useEffect(() => {
        const isValid = selectedProduct && orderer.name && orderer.email;
        setIsFormValid(isValid);
    }, [selectedProduct, orderer]);

    // 🥊 3. 가상계좌 발급 핸들러
    const handleIssueAccount = async () => {
        // 안전성을 위해 productId와 계산된 금액을 함께 전송
        const requestData = {
            productId: selectedProduct.id, 
            productName: selectedProduct.name,
            depositedAmount: selectedProduct.price * quantity,
            transactionId: `TX_${Date.now()}`,
            payUuid: "" 
        };

        try {
            const response = await paymentApi.issueAccount(requestData);
            const data = response.data;

            if (data) {
                // 발급 성공 시 가상계좌 확인 페이지로 이동
                navigate('/user/virtual-account', {
                    state: {
                        payUuid: data.payUuid,
                        maskedAccount: data.maskedAccount,
                        depositedAmount: data.depositedAmount,
                        productName: selectedProduct.name,
                        bankName: data.bankName
                    }
                });
            }
        } catch (error) {
            console.error("발급 오류 상세:", error);
            const errorMessage = error.response?.data?.message || "가상계좌 발급 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-xl font-bold text-blue-600 animate-pulse">
                    📦 상품 정보를 안전하게 불러오는 중...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">
            {/* 좌측: 상품 선택 및 정보 입력 */}
            <div className="flex-1">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">주문하기</h1>
                    <p className="text-gray-500">원하는 상품을 선택하고 가상계좌를 발급받으세요.</p>
                </header>

                {/* 상품 그리드 (DB 데이터 연동) */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-blue-600 font-bold">🛒</span>
                        <h2 className="text-xl font-semibold">상품 선택</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                                    selectedProduct?.id === product.id
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-100 hover:border-blue-200 hover:shadow-sm'
                                }`}
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎁</div>
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <p className="text-blue-600 font-semibold">{product.price.toLocaleString()}원</p>
                            </div>
                        ))}
                    </div>

                    {/* 수량 조절 */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                        <span className="font-medium">수량</span>
                        <div className="flex items-center border bg-white rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-1 text-blue-600 font-bold disabled:text-gray-300"
                                disabled={quantity <= 1}
                            >-</button>
                            <input type="number" value={quantity} readOnly className="w-12 text-center focus:outline-none" />
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-1 text-blue-600 font-bold"
                            >+</button>
                        </div>
                    </div>
                </section>

                {/* 주문자 정보 */}
                <section className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-medium">이름</label>
                            <input
                                type="text"
                                placeholder="홍길동"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setOrderer({ ...orderer, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-medium">이메일</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setOrderer({ ...orderer, email: e.target.value })}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* 우측: 주문 요약 사이드바 */}
            <aside className="w-full md:w-80">
                <div className="sticky top-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold mb-6 border-b pb-2">주문 요약</h3>

                    {selectedProduct ? (
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                                    🎁
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{selectedProduct.name}</p>
                                    <p className="text-sm text-gray-500">{selectedProduct.price.toLocaleString()}원 × {quantity}개</p>
                                </div>
                            </div>
                            <hr className="border-dashed" />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>상품 금액</span>
                                <span>{(selectedProduct.price * quantity).toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>배송비</span>
                                <span className="text-blue-500 font-medium">무료</span>
                            </div>
                            <hr />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">총 결제금액</span>
                                <span className="text-2xl font-black text-blue-600">
                                    {(selectedProduct.price * quantity).toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 space-y-2">
                            <p className="text-4xl opacity-20">🛒</p>
                            <p className="text-gray-400">상품을 선택해주세요</p>
                        </div>
                    )}

                    <button
                        onClick={handleIssueAccount}
                        disabled={!isFormValid}
                        className={`w-full mt-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                            isFormValid 
                            ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200' 
                            : 'bg-gray-300 cursor-not-allowed shadow-none'
                        }`}
                    >
                        💳 가상계좌 발급받기
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 bg-gray-50 py-2 rounded-lg">
                        <span>🛡️ 보안을 위해 일회용 가상계좌가 사용됩니다.</span>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Payment;