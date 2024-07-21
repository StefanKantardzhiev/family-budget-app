import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ExpenseModal.css';
import {api} from "../../../services/rest-api"; // Ensure you have this CSS file for styling

interface ModalProps {
			onClose: () => void;
			onSubmit: (income: IncomeData) => void;
}

interface IncomeData {
			description: string;
			amount: number;
			date: string;
			category: string;
			type: string;
}

const IncomeModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
			const [incomeData, setIncomeData] = useState<IncomeData>({
						description: '',
						amount: 0,
						date: new Date().toISOString().split('T')[0],
						category: '',
						type: 'income',
			});
			const { t } = useTranslation();

			const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
						const { name, value } = e.target;
						setIncomeData(prevData => ({
									...prevData,
									[name]: value,
						}));
			};

			const handleSubmit = async (e: React.FormEvent) => {
						e.preventDefault();
						await api.post('/income', incomeData).then((response:any) => {
									console.log(response.body)
									return response.body
						})
						onSubmit(incomeData);
						onClose();
			};

			return (
					<div className="modal">
								<div className="modal-content">
											<span className="close" onClick={onClose}>&times;</span>
											<h2>{t('addIncome')}</h2>
											<form onSubmit={handleSubmit}>
														<div className="form-group">
																	<label htmlFor="description">{t('description')}:</label>
																	<input
																			type="text"
																			id="description"
																			name="description"
																			value={incomeData.description}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="amount">{t('amount')}:</label>
																	<input
																			type="number"
																			id="amount"
																			name="amount"
																			value={incomeData.amount}
																			onChange={handleChange}
																			min="0"
																			step="0.01"
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="date">{t('date')}:</label>
																	<input
																			type="date"
																			id="date"
																			name="date"
																			value={incomeData.date}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="category">{t('category')}:</label>
																	<select
																			id="category"
																			name="category"
																			value={incomeData.category}
																			onChange={handleChange}
																			required
																	>
																				<option value="">{t('selectCategory')}</option>
																				<option value="salary">{t('salary')}</option>
																				<option value="gifts">{t('gifts')}</option>
																				<option value="investments">{t('investments')}</option>
																				<option value="other">{t('other')}</option>
																	</select>
														</div>
														<div className="form-actions">
																	<button type="submit" className="btn btn-primary">{t('addIncome')}</button>
																	<button type="button" className="btn btn-secondary" onClick={onClose}>{t('cancel')}</button>
														</div>
											</form>
								</div>
					</div>
			);
};

export default IncomeModal;