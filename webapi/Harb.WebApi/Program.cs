using System.Text.Json;
using Harb.Ssh;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSshSession();

builder.Configuration["Logging:LogLevel:Default"] = "Warning";
builder.Configuration["Logging:LogLevel:Microsoft.AspNetCore.Diagnostics.ExceptionHandlerMiddleware"] = "None";
builder.Configuration["Logging:LogLevel:Microsoft.Hosting.Lifetime"] = "Information";
builder.Configuration["Logging:StateJsonConsole:LogLevel:Default"] = "None";
builder.Configuration["Logging:StateJsonConsole:LogLevel:Nist.Logs"] = "Information";
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(c => c.SingleLine = true);
builder.Logging.AddStateJsonConsole();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpIOLogging();
app.UseErrorBody(ex => ex switch {
    _ => Errors.Unknown
});
app.MapControllers();

app.MapGet($"/{Uris.About}", (IHostEnvironment env) => new About(
    Description: "Harb webapi",
    Version: Assembly.GetEntryAssembly()!.GetName().Version!.ToString(),
    Environment: env.EnvironmentName
));

app.MapGet($"/{Uris.Machine}", (SshSession ssh) => JsonFrom(ssh, "harb machine"));
app.MapGet($"/{Uris.Containers}", (SshSession ssh) => JsonFrom(ssh, "harb containers"));

app.Run();

async Task<object> JsonFrom(SshSession ssh, string command){
    var response = await ssh.SendAndWaitTill(command,
        (r) => (r.Trim().StartsWith("[") || r.Trim().StartsWith("{")) && r.Contains("cpu"),
        (r) => r.Trim().EndsWith("]") || r.Trim().EndsWith("}"),
        new CancellationTokenSource(TimeSpan.FromSeconds(10)).Token
    );
    return JsonSerializer.Deserialize<dynamic>(response)!;
}