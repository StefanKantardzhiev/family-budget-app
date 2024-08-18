import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from "../../../services/rest-api";
import './CreateModal.css';

interface CreateModalProps {
			isOpen: boolean;
			onClose: () => void;
			onSubmit: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
			const [id, setId] = useState<string>('');
			const [amount, setAmount] = useState<number>(0);
			const [description, setDescription] = useState<string>('');
			const [createdAt, setCreatedAt] = useState<string>(new Date().toISOString());
			const [category, setCategory] = useState<string>('');
			const [type, setType] = useState<'expense' | 'income'>('expense');
			const [date, setDate] = useState<Date>(new Date());
			const { t } = useTranslation();

			const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
						const { name, value } = e.target;
						switch (name) {
									case 'id':
												setId(value);
												break;
									case 'amount':
												setAmount(parseFloat(value));
												break;
									case 'description':
												setDescription(value);
												break;
									case 'createdAt':
												setCreatedAt(value);
												break;
									case 'category':
												setCategory(value);
												break;
									case 'type':
												setType(value as 'expense' | 'income');
												break;
									case 'date':
												setDate(new Date(value));
												break;
						}
			};

			const handleSubmit = async (e: React.FormEvent) => {
						e.preventDefault();
						const newTransaction = { id, amount, description, createdAt, category, type, date };
						await api.post('/transactions', newTransaction);
						onSubmit();
						onClose();
			};

			if (!isOpen) return null;

			return (
					<div className="modal">
								<div className="modal-content">
											<span className="close" onClick={onClose}>&times;</span>
											<h2>{t('Create Transaction')}</h2>
											<form onSubmit={handleSubmit}>
														<div className="form-group">
																	<label htmlFor="description">{t('Description')}:</label>
																	<input
																			type="text"
																			id="description"
																			name="description"
																			value={description}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="amount">{t('amount')} €:</label>
																	<input
																			type="number"
																			id="amount"
																			name="amount"
																			value={amount}
																			onChange={handleChange}
																			min="0"
																			step="0.01"
																			placeholder="Euro"
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="category">{t('category')}:</label>
																	<select
																			id="category"
																			name="category"
																			value={category}
																			onChange={handleChange}
																			required
																	>
																				<option value="">{t('selectCategory')}</option>
																				<option value="salary">{t('Salary')}</option>
																				<option value="gifts">{t('Gifts')}</option>
																				<option value="shopping">{t('Shopping')}</option>
																				<option value="food">{t('Food')}</option>
																				<option value="car">{t('Car')}</option>
																				<option value="insurance">{t('Insurance')}</option>
																				<option value="travel">{t('Travel')}</option>
																				<option value="rent">{t('Rent')}</option>
																				<option value="medical">{t('Medical')}</option>
																				<option value="vape">{t('Vape')}</option>
																	</select>
														</div>
														<div className="form-group">
														<label htmlFor="type">{t('Type')}:</label>
																	<select
																			id="type"
																			name="type"
																			value={type}
																			onChange={handleChange}
																			required
																	>
																				<option value="">{t('Select Type')}</option>
																				<option value="income">{t('income')}</option>
																				<option value="expense">{t('expense')}</option>
																	</select>
														</div>
														<div className="form-group">
																	<label htmlFor="date">{t('date')}:</label>
																	<input
																			type="date"
																			id="date"
																			name="date"
																			value={date.toISOString().split('T')[0]}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-actions">
																	<button type="submit" className="btn btn-primary">{t(
																			'Create Transaction')}</button>
																	<button type="button" className="btn btn-secondary" onClick={onClose}>{t(
																			'Cancel')}</button>
														</div>
											</form>
								</div>
					</div>
			);
};
export default CreateModal;