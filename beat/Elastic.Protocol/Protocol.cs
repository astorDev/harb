using System.Net.Http.Json;
using Nist.Responses;

namespace Elastic;

public class Uris {
    public static string Doc(string index, string id) => $"{index}/_doc/{id}";
}

public class Client { 
    public HttpClient Http { get; }
    public Client(HttpClient http) {
        this.Http = http;
    }

    public Task<dynamic> Put(string index, string id, object doc, CancellationToken? cancellationToken = null) => 
        this.Http.PutAsJsonAsync(Uris.Doc(index, id), doc, cancellationToken ?? CancellationToken.None).Read<dynamic>();
}