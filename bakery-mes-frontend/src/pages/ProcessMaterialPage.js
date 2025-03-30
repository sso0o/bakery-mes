import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProcessMaterialPage.css';

const ProcessMaterialPage = () => {
    const [productProcesses, setProductProcesses] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedPP, setSelectedPP] = useState(null);
    const [processMaterials, setProcessMaterials] = useState([]);
    const [form, setForm] = useState({ materialId: '', quantity: '', unit: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const ppRes = await axios.get('http://localhost:8080/api/product-process/all');
        const mRes = await axios.get('http://localhost:8080/api/materials');
        setProductProcesses(ppRes.data);
        setMaterials(mRes.data);
    };

    const fetchProcessMaterials = async (ppId) => {
        const res = await axios.get(`http://localhost:8080/api/process-materials/${ppId}`);
        setProcessMaterials(res.data);
    };


    const handlePPChange = (e) => {
        const ppId = e.target.value;
        const selected = productProcesses.find(p => p.id === parseInt(ppId));
        setSelectedPP(selected);
        fetchProcessMaterials(ppId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'materialId') {
            const selected = materials.find(m => m.id === parseInt(value));
            if (selected) setForm(prev => ({ ...prev, unit: selected.unit }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            productProcess: { id: selectedPP.id },
            material: { id: form.materialId },
            quantity: parseFloat(form.quantity),
            unit: form.unit
        };
        await axios.post('http://localhost:8080/api/process-materials', data);
        setForm({ materialId: '', quantity: '', unit: '' });
        fetchProcessMaterials(selectedPP.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        await axios.delete(`http://localhost:8080/api/process-materials/${id}`);
        fetchProcessMaterials(selectedPP.id);
    };

    return (
        <div className="page-container">
            <div className="left-panel">
                <h2>공정 선택</h2>
                <select onChange={handlePPChange}>
                    <option value="">선택</option>
                    {productProcesses.map(pp => (
                        <option key={pp.id} value={pp.id}>
                            [{pp.product.name}] {pp.process.name}
                        </option>
                    ))}
                </select>

                {selectedPP && (
                    <>
                        <h3>자재 소모 목록</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>자재</th>
                                <th>수량</th>
                                <th>단위</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {processMaterials.map(pm => (
                                <tr key={pm.id}>
                                    <td>{pm.material.name}</td>
                                    <td>{pm.quantity}</td>
                                    <td>{pm.unit}</td>
                                    <td>
                                        <button onClick={() => handleDelete(pm.id)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <div className="right-panel">
                <h2>자재 소모 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        자재
                        <select name="materialId" value={form.materialId} onChange={handleChange} required>
                            <option value="">선택</option>
                            {materials.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        수량
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
                    </label>
                    <label>
                        단위
                        <input type="text" name="unit" value={form.unit} readOnly />
                    </label>
                    <button type="submit">등록</button>
                </form>
            </div>
        </div>
    );
};

export default ProcessMaterialPage;
