import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { paymentApi } from '../../api/paymentApi';
import { useAuthStore } from '../../store/useAuthStore'; // 1. 스토어 임포트

const Payment = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuthStore(); // 2. 로그인된 사용자 정보 가져오기
    
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    
    // 3. 초기 상태를 빈 값이 아닌 userInfo의 값으로 설정 (방어 코드 포함)
    const [orderer, setOrderer] = useState({ 
        name: userInfo?.name || '', 
        email: userInfo?.email || '' 
    });
    
    const [isFormValid, setIsFormValid] = useState(false);

    // 4. 만약 스토어 정보가 늦게 로드될 경우를 대비해 감시 로직 추가
    useEffect(() => {
        if (userInfo) {
            setOrderer({
                name: userInfo.name || '',
                email: userInfo.email || ''
            });
        }
    }, [userInfo]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/products'); 
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

    useEffect(() => {
        const isValid = selectedProduct && orderer.name && orderer.email;
        setIsFormValid(isValid);
    }, [selectedProduct, orderer]);

    const handleIssueAccount = async () => {
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
            <div className="flex-1">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">주문하기</h1>
                    <p className="text-gray-500">원하는 상품을 선택하고 가상계좌를 발급받으세요.</p>
                </header>

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

                <section className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-medium">이름</label>
                            <input
                                type="text"
                                placeholder="홍길동"
                                value={orderer.name} // 5. 상태값 바인딩
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setOrderer({ ...orderer, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-medium">이메일</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={orderer.email} // 5. 상태값 바인딩
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setOrderer({ ...orderer, email: e.target.value })}
                            />
                        </div>
                    </div>
                </section>
            </div>

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