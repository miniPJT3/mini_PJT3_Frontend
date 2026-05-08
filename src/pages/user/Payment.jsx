import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';
// import { paymentApi } from '../api/paymentApi'; // API 연동 시 주석 해제

const products = [
    { id: 1, name: '프리미엄 헤드폰', price: 150000, img: '🎧' },
    { id: 2, name: '무선 키보드', price: 89000, img: '⌨️' },
    { id: 3, name: '게이밍 마우스', price: 65000, img: '🖱️' },
    { id: 4, name: '웹캠 HD', price: 120000, img: '📷' },
    { id: 5, name: 'USB 허브', price: 35000, img: '🔌' },
    { id: 6, name: '모니터 암', price: 45000, img: '🖥️' },
];

const Payment = () => {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [orderer, setOrderer] = useState({ name: '', email: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    // 입력값 검증 로직
    useEffect(() => {
        const isValid = selectedProduct && orderer.name && orderer.email;
        setIsFormValid(isValid);
    }, [selectedProduct, orderer]);

    const handleIssueAccount = async () => {
        // 1. 전송할 데이터 구성
        const requestData = {
            productName: selectedProduct.name,
            depositedAmount: selectedProduct.price * quantity,
            transactionId: `TX_${Date.now()}`,
            payUuid: "" // 신규 발급 시에는 빈 문자열
        };

        try {
            // 2. 실제 API 호출 (paymentApi 사용)
            const response = await paymentApi.issueAccount(requestData);

            // 3. 백엔드에서 내려준 응답 데이터 (PaymentResponse DTO)
            const data = response.data;

            if (data) {
                // 4. 성공 시 다음 페이지로 데이터 전달하며 이동
                navigate('/virtual-account', {
                    state: {
                        payUuid: data.payUuid,            // 백엔드가 생성한 진짜 UUID
                        maskedAccount: data.maskedAccount, // 백엔드가 생성한 진짜 계좌번호
                        depositedAmount: data.depositedAmount,
                        productName: selectedProduct.name
                    }
                });
            }
        } catch (error) {
            // 5. 에러 처리 (400, 403, 500 등)
            console.error("발급 오류 상세:", error);
            const errorMessage = error.response?.data?.message || "가상계좌 발급 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    };
    return (
        <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">
            {/* 좌측: 상품 선택 및 정보 입력 */}
            <div className="flex-1">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">주문하기</h1>
                    <p className="text-gray-500">상품을 선택하고 주문 정보를 입력하세요.</p>
                </header>

                {/* 상품 그리드 */}
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
                                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${selectedProduct?.id === product.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-100 hover:shadow-md'
                                    }`}
                            >
                                <div className="text-4xl mb-4">{product.img}</div>
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
                <section className="p-6 bg-white border border-gray-100 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">주문자 정보</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">이름</label>
                            <input
                                type="text"
                                placeholder="홍길동"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setOrderer({ ...orderer, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">이메일</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setOrderer({ ...orderer, email: e.target.value })}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* 우측: 주문 요약 사이드바 */}
            <aside className="w-full md:w-80">
                <div className="sticky top-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold mb-6">주문 요약</h3>

                    {selectedProduct ? (
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                    {selectedProduct.img}
                                </div>
                                <div>
                                    <p className="font-bold">{selectedProduct.name}</p>
                                    <p className="text-sm text-gray-500">{selectedProduct.price.toLocaleString()}원 × {quantity}개</p>
                                </div>
                            </div>
                            <hr />
                            <div className="flex justify-between text-sm">
                                <span>상품 금액</span>
                                <span>{(selectedProduct.price * quantity).toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>배송비</span>
                                <span className="text-green-500 font-medium">무료</span>
                            </div>
                            <hr />
                            <div className="flex justify-between items-center">
                                <span className="font-bold">총 결제금액</span>
                                <span className="text-xl font-bold text-blue-600">
                                    {(selectedProduct.price * quantity).toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-10">상품을 선택해주세요</p>
                    )}

                    <button
                        onClick={handleIssueAccount}
                        disabled={!isFormValid}
                        className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        💳 가상계좌 발급받기
                    </button>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        주문 시 일회용 가상계좌가 자동 발급됩니다.
                    </p>
                </div>
            </aside>
        </div>
    );
};

export default Payment;