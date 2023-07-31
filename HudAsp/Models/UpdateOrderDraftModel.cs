public class UpdateOrderDraftModel
{
    public string? DocEntry { get; set; }
    public string? CardCode { get; set; }
    public string? ContactPersonCode { get; set; }
    public string? NumAtCard { get; set; }
    public string? ShipToCode { get; set; }
    public string? PayToCode { get; set; }
    public string? DocCurrency { get; set; }
    public string? DocObjectCode { get; set; }
    public string? DocDate { get; set; }
    public string? DocDueDate { get; set; }
    public string? TaxDate { get; set; }
    public string? GroupNum { get; set; }
    public string? Comments { get; set; }
    public string? Series { get; set; }
    public string? U_HMK_TRANS { get; set; }
    public string? U_DGP_DropConsignment { get; set; }
    public string? U_DGP_NumAtCardSup { get; set; }
    public List<DocumentLinesUpdate> DocumentLines { get; set; }
}

public class DocumentLinesUpdate
{
    public string LineNum { get; set; }
    public string ItemCode { get; set; }
    public string WarehouseCode { get; set; }
    public string UnitPrice { get; set; }
    public string Quantity { get; set; }
    public string DiscountPercent { get; set; }
    public string VatGroup { get; set; }
    public string ShipDate { get; set; }
}

public class DocumentLinesToSend
{
    public string ItemCode { get; set; }
    public string WarehouseCode { get; set; }
    public string UnitPrice { get; set; }
    public string Quantity { get; set; }
    public string DiscountPercent { get; set; }
    public string VatGroup { get; set; }
    public string ShipDate { get; set; }
}

