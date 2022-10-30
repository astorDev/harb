using System.Text;
using Harb.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Renci.SshNet;

namespace Harb.Ssh;

public class SshSession : IDisposable {
    private readonly SshClient client;

    public SshSession(string host, string username, string password) {
        this.client = new (host, username, password);
        this.client.Connect();
    }

    public void Dispose() => client.Disconnect();

    public async Task<string> SendAndWaitTill(
        string command, 
        Func<string, bool> isBeggining,
        Func<string, bool> isEnd,
        CancellationToken? cancellationToken = null) 
    {
        var began = false;
        var result = new StringBuilder();
        var tcs = new TaskCompletionSource<string>();
        cancellationToken?.Register(() => tcs.TrySetCanceled());

        await using var shellStream = this.client.CreateShellStream("xterm", 800, 1000, 800, 600, 9000);
        shellStream.WriteLine(command);
        
        shellStream.DataReceived += (_, args) => {
            var received = Encoding.UTF8.GetString(args.Data);

            if (!began) began = isBeggining(received);
            
            if (began) {
                result.Append(received);
                if (isEnd(received)) tcs.SetResult(result.ToString());
            }
        };

        shellStream.ErrorOccurred += (_, args) => {
            tcs.SetException(args.Exception);
        };

        return await tcs.Task;
    }
}

public class SshException : Exception { public SshException(string message) : base(message) {} }

public static class SshRegistration {
    public const string Host = "SshHost";
    public const string Username = "SshUsername";
    public const string Password = "SshPassword";

    public static void AddSshSession(this IServiceCollection services) {
        services.AddScoped(sp => {
            var configuration = sp.GetRequiredService<IConfiguration>();

            var host = configuration.GetRequiredValue(Host);
            var username = configuration.GetRequiredValue(Username);
            var password = configuration.GetRequiredValue(Password);

            return new SshSession(host, username, password);
        });
    }
}