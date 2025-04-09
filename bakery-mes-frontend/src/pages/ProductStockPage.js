import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductStockPage() {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/product-stocks').then(res => {
            setStocks(res.data);
        });
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>제품 재고 조회</h2>
            <table border="1" style={{ width: '100%', marginTop: 20 }}>
                <thead>
                <tr>
                    <th>제품 코드</th>
                    <th>제품명</th>
                    <th>LOT 번호</th>
                    <th>수량</th>
                </tr>
                </thead>
                <tbody>
                {stocks.map((s, idx) => (
                    <tr key={idx}>
                        <td>{s.productCode}</td>
                        <td>{s.productName}</td>
                        <td>{s.lotNumber}</td>
                        <td>{s.quantity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductStockPage;
