import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InvoiceItem } from "../../../../core/models/invoice/invoice.model";
import { DISCOUNTS, LEVELS } from '../../../constants/app';
import {RippleModule} from "primeng/ripple";

@Component({
    selector: 'app-table-create-invoice',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        RippleModule
    ],
    providers: [MessageService],
    templateUrl: './table-create-invoice.component.html'
})
export class TableCreateInvoice implements OnInit {
    @Input() items: InvoiceItem[] = [];
    @Output() itemsChange = new EventEmitter<InvoiceItem[]>();

    @ViewChild('dt') table!: Table;

    products: SelectItem[] = [];
    taxRates: SelectItem[] = [];
    discounts: SelectItem[] = DISCOUNTS;

    newItem: InvoiceItem = this.initNewItem();
    editingItem?: InvoiceItem;
    showItemDialog = false;
    submitted = false;
    isEditing = false;

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        // Initialize products from LEVELS
        this.products = LEVELS.map(level => ({
            label: level.label,
            value: level.value
        }));

        // Initialize tax rates
        this.taxRates = [
            { label: 'Isento (0%)', value: 0 },
            { label: 'IVA (14%)', value: 14 },
            { label: 'IVA (7%)', value: 7 }
        ];
    }

    initNewItem(): InvoiceItem {
        return {
            id: this.generateId(),
            description: '',
            quantity: 1,
            unit_price: 0,
            discount: 0,
            tax_rate: 14,
            total: 0,
            product_id: false,
            product: '',
            price: 0,
            vat: 0,
            amount: 0
        };
    }

    generateId(): number {
        return Math.floor(Math.random() * 1000000);
    }

    openNew() {
        this.newItem = this.initNewItem();
        this.submitted = false;
        this.isEditing = false;
        this.showItemDialog = true;
    }

    editItem(item: InvoiceItem) {
        this.editingItem = { ...item };
        this.isEditing = true;
        this.showItemDialog = true;
    }

    deleteItem(item: InvoiceItem) {
        this.items = this.items.filter(i => i.id !== item.id);
        this.itemsChange.emit([...this.items]);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item removido', life: 3000 });
    }

    hideDialog() {
        this.showItemDialog = false;
        this.submitted = false;
    }

    calculateTotal(item: InvoiceItem): number {
        const subtotal = item.quantity * item.unit_price;
        const discountAmount = subtotal * (item.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * (item.tax_rate / 100);
        return afterDiscount + taxAmount;
    }

    saveItem() {
        this.submitted = true;

        const itemToSave = this.isEditing ? this.editingItem! : this.newItem;

        // Validate required fields
        if (!itemToSave.product_id || !itemToSave.description || itemToSave.quantity <= 0 || itemToSave.unit_price <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios', life: 3000 });
            return;
        }

        // Calculate total
        itemToSave.total = this.calculateTotal(itemToSave);

        if (this.isEditing) {
            // Update existing item
            const index = this.items.findIndex(i => i.id === itemToSave.id);
            if (index !== -1) {
                this.items[index] = itemToSave;
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item atualizado', life: 3000 });
            }
        } else {
            // Add new item
            this.items.push(itemToSave);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item adicionado', life: 3000 });
        }

        // Emit updated items
        this.itemsChange.emit([...this.items]);

        // Reset and close dialog
        this.showItemDialog = false;
    }

    onProductChange(event: any, item: InvoiceItem) {
        const selectedProduct = this.products.find(p => p.value === event.value);
        if (selectedProduct) {
            item.description = selectedProduct.label!;
        }
    }

    getProductName(productId: any): string {
        const product = this.products.find(p => p.value === productId);
        return product ? product.label! : '';
    }
}
