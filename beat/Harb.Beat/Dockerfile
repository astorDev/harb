FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["beat/Harb.Beat/Harb.Beat.csproj", "beat/Harb.Beat/"]
COPY ["beat/Elastic.Protocol/Elastic.Protocol.csproj", "beat/Elastic.Protocol/"]
COPY ["webapi/Harb.Protocol/Harb.Protocol.csproj", "webapi/Harb.Protocol/"]
COPY ["webapi/Harb.Configuration/Harb.Configuration.csproj", "webapi/Harb.Configuration/"]
RUN dotnet restore "beat/Harb.Beat/Harb.Beat.csproj"
COPY . .
WORKDIR "/src/beat/Harb.Beat"
RUN dotnet build "Harb.Beat.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Harb.Beat.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT dotnet Harb.Beat.dll