
public class DGPAWUSR3RACollection
{
	public int LineId { get; set; }
	public string U_DGP_AW_ActionCode { get; set; }
	public string U_DGP_AW_ActionName { get; set; }
}

public class UpdateActionsRol
{
	public string Code { get; set; }
	public List<DGPAWUSR3RACollection> DGP_AW_USR3RACollection { get; set; }
}

