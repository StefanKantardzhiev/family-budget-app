export interface ModalProps {
			onClose: () => void;
			onSubmit: (expense: ExpenseData) => void;
}

export interface ExpenseData {
			description: string;
			amount: number;
			date: string;
			category: string;
			type: string;
}