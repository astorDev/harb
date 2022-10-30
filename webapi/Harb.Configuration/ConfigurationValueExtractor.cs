using Microsoft.Extensions.Configuration;

namespace Harb.Configuration;

public static class ConfigurationValueExtractor {
    public static string GetRequiredValue(this IConfiguration configuration, string key) {
        var value = configuration[key];
        if (String.IsNullOrEmpty(value)) throw new ConfigurationValueMissingException(key);
        return value;
    }
}

public class ConfigurationValueMissingException : Exception {
    public ConfigurationValueMissingException(string key) : base($"Configuration value '{key}' is missing"){}
}