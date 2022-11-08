public class HarbBeatController {
    readonly Harb.Client harb;
    readonly Elastic.Client elastic;

    public HarbBeatController(Harb.Client harb, Elastic.Client elastic) { 
        this.harb = harb;
        this.elastic = elastic;
    }

    [RunsEvery("00:00:16")]
    public async Task<string> ShipMachine() {
        var machine = await this.harb.GetMachineDynamic(
            new CancellationTokenSource(TimeSpan.FromSeconds(3)).Token
        ).ToSystemDynamic();

        var doc = new {
            @timestamp = DateTime.Now,
            body = machine
        };

        var shipped = await elastic.Put(
            $"harb-machine-{DateTime.Now:yyyy.MM.dd}", 
            Guid.NewGuid().ToString(), 
            doc
        );

        return $"{shipped._index}:{shipped._id}";
    }

    [RunsEvery("00:00:07")]
    public async Task<string[]> ShipContainers() {
        var containers = await this.harb.GetContainersDynamic(
            new CancellationTokenSource(TimeSpan.FromSeconds(10)).Token
        );

        var result = new List<string>();

        foreach (var c in containers) {
            var doc = new {
                @timestamp = DateTime.Now,
                body = ((object)c).ToSystemDynamic()
            };

            var shipped = await elastic.Put(
                $"harb-containers-{DateTime.Now:yyyy.MM.dd}",
                Guid.NewGuid().ToString(),
                doc
            );

            result.Add($"{shipped._index}:{shipped._id}");
        }

        return result.ToArray();
    }
}

public static class JsonAdapter {
    public static async Task<dynamic> ToSystemDynamic(this Task<dynamic> dynamicProducer) {
        var obj = await dynamicProducer;
        return ToSystemDynamic((object)obj!);
    }

    public static dynamic ToSystemDynamic(this object obj) {
        var json = JsonConvert.SerializeObject(obj)!;
        return System.Text.Json.JsonSerializer.Deserialize<dynamic>(json)!;
    }
}