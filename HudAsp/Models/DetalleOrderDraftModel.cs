// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
public class DetalleOrderDraftModel
{
    public string Usuario { get; set; }
    public string CodArticulo { get; set; }
    public string Descripcion { get; set; }
    public string Almacen { get; set; }
    public string IndicadorImpuesto { get; set; }
    public string Moneda { get; set; }
    public string CodTerminoPago { get; set; }
    public string TerminoPago { get; set; }
    public string Monto { get; set; }
    public string Descuento { get; set; }
    public string CantidadAlmacen { get; set; }
    public string StockGeneral { get; set; }
    public string Cantidad { get; set; }
    public string PrecioUnitario { get; set; }
    public string CodigodeBarra { get; set; }
    public string ValorImpuesto { get; set; }
}

