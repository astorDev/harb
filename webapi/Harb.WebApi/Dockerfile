FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Harb.WebApi/Harb.WebApi.csproj", "Harb.WebApi/"]
COPY ["Harb.Protocol/Harb.Protocol.csproj", "Harb.Protocol/"]
RUN dotnet restore "Harb.WebApi/Harb.WebApi.csproj"
COPY . .
WORKDIR "/src/Harb.WebApi"
RUN dotnet build "Harb.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Harb.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Harb.WebApi.dll"]