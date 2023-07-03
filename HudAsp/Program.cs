using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HudAsp.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

//BEGIN Agregado
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
   .AddCookie(options =>
   {
	   options.Cookie.Name = "Usuario";
	   options.ExpireTimeSpan = TimeSpan.FromMinutes(20); 
	   options.SlidingExpiration = true;
	   options.LoginPath = "/Login/Login";
   });

builder.Services.AddAuthorization();

// Configure authentication
builder.Services.ConfigureApplicationCookie(options =>
{
	options.ExpireTimeSpan = TimeSpan.FromDays(30);
	options.SlidingExpiration = true;
});

builder.Services.AddSession();
builder.Services.AddHttpContextAccessor();

//END agregado


// Add Sidebar menu json file
builder.Configuration.AddJsonFile("sidebar.json", optional: true, reloadOnChange: true);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(options =>
{
	options.AllowAnyOrigin();
	options.AllowAnyMethod();
	options.AllowAnyHeader();
});


app.MapControllerRoute(
	name: "default",
	//pattern: "{controller=Consulta}/{action=OrderDraft}/{id?}");
	pattern: "{controller=Login}/{action=Login}"
);

//app.UseEndpoints(endpoints =>
//{
//	endpoints.MapAreaControllerRoute(
//			name: "Identity",
//			areaName: "Identity",
//			pattern: "Identity/{controller=Ingreso}/{action=OrderDraft}");
//	endpoints.MapControllers();
//});

app.UseSession();

app.MapRazorPages();

app.Run();

