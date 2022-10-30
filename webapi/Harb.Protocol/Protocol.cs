namespace Harb;

public class Uris{
    public const string About = "about";
    public const string Machine = "machine";
    public const string Containers = "containers";
}

public record About(string Description, string Version, string Environment);

public interface IClient {
    Task<About> GetAbout();
}

public class Client {
    public HttpClient Http { get; }
    public Client(HttpClient http) { this.Http = http; }

    public Task<About> GetAbout() => this.Http.GetAsync(Uris.About).Read<About>();
}

public class Errors {
    public static Error Unknown => new (HttpStatusCode.InternalServerError, "Unknown");
}