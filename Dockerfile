FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY AtemServer/dist /app
ENTRYPOINT ["dotnet", "AtemServer.dll"]